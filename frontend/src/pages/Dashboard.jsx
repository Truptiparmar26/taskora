import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Stack, Hourglass, CheckCircle, TrendUp, Plus, 
  ArrowRight, Calendar, Flag, ChartBar, Sparkle, Note as NoteIcon 
} from '@phosphor-icons/react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

// Premium Color Palette for Data Visualization
const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981']; // Amber, Blue, Emerald
const PRIORITY_COLOR = '#6366F1'; // Vibrant Indigo

// Custom Glassmorphic Recharts Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0];
    const value = dataItem.value !== undefined ? dataItem.value : dataItem.payload.count;
    return (
      <div style={{
        background: 'var(--bg-sidebar)',
        border: '1px solid var(--border)',
        padding: '10px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
        color: 'var(--text-primary)',
        fontWeight: '600',
        fontSize: '0.88rem'
      }}>
        <span style={{ color: dataItem.color || 'var(--primary)', marginRight: '6px' }}>●</span>
        {`${dataItem.name}: ${value}`}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ darkMode, toggleTheme }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks"); 
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Statistical Metrics Calculation
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Chart Formatted Data
  const statusData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.progress },
    { name: 'Completed', value: stats.completed },
  ].filter(item => item.value > 0);

  const priorityCounts = tasks.reduce((acc, task) => {
    const p = task.priority || 'medium';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const priorityData = [
    { name: 'Low', count: priorityCounts.low || 0 },
    { name: 'Medium', count: priorityCounts.medium || 0 },
    { name: 'High', count: priorityCounts.high || 0 },
  ];

  // Slice recent tasks for Quick Snapshot table
  const recentTasks = [...tasks].reverse().slice(0, 5);

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      {loading ? (
        <div className="loading-state" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', animation: 'pulse 1.5s infinite' }}>
            ✨ Synchronizing your professional workspace...
          </div>
        </div>
      ) : (
        <div className="dashboard-view">
          
          {/* --- HERO WELcoming BANNER --- */}
          <section className="hero-banner">
            <div className="hero-left">
              <span className="hero-tag"><Sparkle size={15} weight="fill" /> Productivity Suite</span>
              <h1 className="hero-title">
                {getGreeting()}, <span>{user?.name || 'Explorer'}</span>!
              </h1>
              <p className="hero-subtitle">
                You have successfully executed <strong>{stats.completed}</strong> of your <strong>{stats.total}</strong> scheduled assignments. Keep maximizing your workflow momentum today!
              </p>

              <div className="hero-actions">
                <Link to="/my-tasks" className="btn-hero-primary">
                  <Plus size={20} weight="bold" /> Create New Task
                </Link>
                <Link to="/mynotes" className="btn-hero-secondary">
                  <NoteIcon size={20} weight="fill" /> Access MyNotes
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="progress-info">
                <h4>Completion Rate</h4>
                <div className="percentage">{completionRate}%</div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `conic-gradient(var(--primary) ${completionRate * 3.6}deg, var(--border) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px var(--primary-glow)'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}>
                  🎯
                </div>
              </div>
            </div>
          </section>

          {/* --- KPI STAT CARDS --- */}
          <section className="stats-grid">
            {/* Card 1: Total Tasks */}
            <div className="stat-card blue">
              <div className="stat-top">
                <div className="stat-labels">
                  <p>Total Tasks</p>
                  <h3>{stats.total}</h3>
                </div>
                <div className="stat-icon icon-blue">
                  <Stack size={28} weight="duotone" />
                </div>
              </div>
              <div className="stat-bottom">
                <span className="stat-tag blue-tag">● All tracked workflows</span>
              </div>
            </div>

            {/* Card 2: Pending & In-Progress */}
            <div className="stat-card yellow">
              <div className="stat-top">
                <div className="stat-labels">
                  <p>In Progress / Pending</p>
                  <h3>{stats.pending + stats.progress}</h3>
                </div>
                <div className="stat-icon icon-yellow">
                  <Hourglass size={28} weight="duotone" />
                </div>
              </div>
              <div className="stat-bottom">
                <span className="stat-tag yellow-tag">⚡ Requires attention</span>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="stat-card green">
              <div className="stat-top">
                <div className="stat-labels">
                  <p>Completed Tasks</p>
                  <h3>{stats.completed}</h3>
                </div>
                <div className="stat-icon icon-green">
                  <CheckCircle size={28} weight="duotone" />
                </div>
              </div>
              <div className="stat-bottom">
                <span className="stat-tag green-tag">🚀 {completionRate}% Success Rate</span>
              </div>
            </div>
          </section>

          {/* --- DATA VISUALIZATION & CHARTS --- */}
          <section className="charts-container">
            {/* Chart 1: Task Status Donut */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title-wrap">
                  <span className="chart-icon"><TrendUp size={22} weight="bold" /></span>
                  <h3>Task Status Distribution</h3>
                </div>
              </div>

              <div className="chart-wrapper">
                {stats.total === 0 ? (
                  <div className="empty-chart-state">
                    <div className="empty-icon-wrap"><Stack size={34} weight="thin" /></div>
                    <h4>No Task Data Yet</h4>
                    <p>Your analytics will illuminate immediately once you create your initial tasks.</p>
                    <Link to="/my-tasks" className="view-all-link" style={{ marginTop: '0.5rem' }}>+ Add First Task</Link>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              {stats.total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  {statusData.map((item, idx) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[idx % STATUS_COLORS.length] }}></span>
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chart 2: Priority Distribution Bar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title-wrap">
                  <span className="chart-icon"><ChartBar size={22} weight="bold" /></span>
                  <h3>Priority Allocation</h3>
                </div>
              </div>

              <div className="chart-wrapper">
                {stats.total === 0 ? (
                  <div className="empty-chart-state">
                    <div className="empty-icon-wrap"><ChartBar size={34} weight="thin" /></div>
                    <h4>No Priority Breakdown</h4>
                    <p>Assign Low, Medium, and High priorities to your tasks to track workload intensity.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={priorityData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                      <YAxis stroke="var(--text-muted)" allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={PRIORITY_COLOR} radius={[8, 8, 0, 0]} maxBarSize={50}>
                        {priorityData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={index === 2 ? '#EF4444' : index === 1 ? '#F59E0B' : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              {stats.total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '4px', background: '#3B82F6' }}></span> Low
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '4px', background: '#F59E0B' }}></span> Medium
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '4px', background: '#EF4444' }}></span> High
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* --- RECENT ACTIVITY SNAPSHOT SECTION --- */}
          <section className="recent-activity-section">
            <div className="section-header">
              <h3><Calendar size={22} weight="duotone" style={{ color: 'var(--primary)' }} /> Recent Activity Snapshot</h3>
              <Link to="/my-tasks" className="view-all-link">
                View All Tasks <ArrowRight size={16} weight="bold" />
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.95rem' }}>Your upcoming deadlines and task milestones will be featured here.</p>
              </div>
            ) : (
              <div className="activity-table-container">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Task Title</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => {
                      const priorityClass = `priority-${task.priority || 'medium'}`;
                      const statusClass = `badge-${task.status || 'pending'}`;
                      const formattedDate = task.dueDate 
                        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'No Date';

                      return (
                        <tr key={task._id} className="activity-row" onClick={() => window.location.href = '/my-tasks'}>
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{task.title}</div>
                            {task.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.description}</div>}
                          </td>
                          <td>
                            <span className={`priority-chip ${priorityClass}`}>
                              <Flag size={12} weight="fill" /> {task.priority || 'Medium'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{formattedDate}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`badge-pill ${statusClass}`}>
                              {task.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      )}
    </Layout>
  );
}