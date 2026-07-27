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
  const { user, showToast } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks from dashboard command center:", err);
        if (showToast) {
          showToast("Could not sync tasks from database server.", "Sync Warning ⚠️", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Calculate Operational KPI Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => (t.status || '').toLowerCase() === "completed").length;
  const pendingTasks = tasks.filter(t => (t.status || '').toLowerCase() === "pending").length;
  const inProgressTasks = tasks.filter(t => (t.status || '').toLowerCase() === "in-progress" || (t.status || '').toLowerCase() === "progress").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pie Chart Data: Task Status Distribution
  const pieData = [
    { name: 'Pending', value: pendingTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Completed', value: completedTasks }
  ];

  // Bar Chart Data: Task Priority Distribution
  const highPriority = tasks.filter(t => (t.priority || '').toLowerCase() === "high").length;
  const medPriority = tasks.filter(t => (t.priority || '').toLowerCase() === "medium").length;
  const lowPriority = tasks.filter(t => (t.priority || '').toLowerCase() === "low").length;
  const barData = [
    { name: 'High Priority', count: highPriority },
    { name: 'Medium Priority', count: medPriority },
    { name: 'Low Priority', count: lowPriority }
  ];

  // Sort tasks by creation date (newest first) for activity feed
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())).slice(0, 5);

  const getStatusBadgeClass = (status) => {
    if (status === 'completed') return 'badge-pill badge-completed';
    if (status === 'in-progress') return 'badge-pill badge-progress';
    return 'badge-pill badge-pending';
  };

  const getPriorityChipClass = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high') return 'priority-chip priority-high';
    if (p === 'medium') return 'priority-chip priority-medium';
    return 'priority-chip priority-low';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Deadline';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="dashboard-wrapper">

        {/* =========================================================
            1. HERO WELCOMING BANNER
            ========================================================= */}
        <section className="hero-banner">
          <div className="hero-left">
            <div className="hero-tag">
              <Sparkle size={16} weight="fill" />
              <span>Executive Analytics Hub</span>
            </div>
            <h1 className="hero-title">
              {getGreeting()}, <span>{user?.name || 'Executive'}</span>
            </h1>
            <p className="hero-subtitle">
              You currently have <strong>{inProgressTasks + pendingTasks} active targets</strong> underway. Stay focused and accelerate your team workflow momentum.
            </p>

            <div className="hero-actions">
              <Link to="/my-tasks" className="btn-hero-primary">
                <Plus size={18} weight="bold" />
                <span>Create New Task</span>
              </Link>
              <Link to="/mynotes" className="btn-hero-secondary">
                <NoteIcon size={18} weight="bold" />
                <span>Manage Workspace Notes</span>
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="progress-info">
              <h4>Total Momentum</h4>
              <div className="percentage">{completionRate}%</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Workflow completion velocity</span>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `conic-gradient(var(--primary) ${completionRate}%, var(--border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendUp size={22} color="var(--primary)" weight="bold" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. STAT KPI CARDS GRID
            ========================================================= */}
        <section className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-top">
              <div className="stat-labels">
                <p>Total Tasks</p>
                <h3>{totalTasks}</h3>
              </div>
              <div className="stat-icon icon-blue">
                <Stack weight="fill" />
              </div>
            </div>
            <div className="stat-bottom">
              <span className="stat-tag blue-tag">
                <TrendUp size={16} weight="bold" /> Operational
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workspace targets</span>
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="stat-top">
              <div className="stat-labels">
                <p>Active & In-Progress</p>
                <h3>{pendingTasks + inProgressTasks}</h3>
              </div>
              <div className="stat-icon icon-yellow">
                <Hourglass weight="fill" />
              </div>
            </div>
            <div className="stat-bottom">
              <span className="stat-tag yellow-tag">
                <Hourglass size={16} weight="bold" /> Pending Action
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting delivery</span>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-top">
              <div className="stat-labels">
                <p>Completed Milestones</p>
                <h3>{completedTasks}</h3>
              </div>
              <div className="stat-icon icon-green">
                <CheckCircle weight="fill" />
              </div>
            </div>
            <div className="stat-bottom">
              <span className="stat-tag green-tag">
                <CheckCircle size={16} weight="bold" /> {completionRate}% Hit Rate
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Successfully executed</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. INTERACTIVE DATA ANALYTICS DECK (CHARTS)
            ========================================================= */}
        <section className="charts-container">
          
          {/* CHART 1: TASK STATUS BREAKDOWN */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title-wrap">
                <div className="chart-icon"><ChartBar size={22} weight="fill" /></div>
                <h3>Workflow Status Distribution</h3>
              </div>
            </div>

            <div className="chart-wrapper">
              {totalTasks === 0 ? (
                <div className="empty-chart-state">
                  <div className="empty-icon-wrap"><ChartBar size={32} /></div>
                  <h4>No Data Recorded Yet</h4>
                  <p>Create active goals in your target repository to populate live visual analytic charts.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* CHART 2: PRIORITY TARGET ALLOCATION */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title-wrap">
                <div className="chart-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}>
                  <Flag size={22} weight="fill" />
                </div>
                <h3>Target Priority Allocation</h3>
              </div>
            </div>

            <div className="chart-wrapper">
              {totalTasks === 0 ? (
                <div className="empty-chart-state">
                  <div className="empty-icon-wrap"><Flag size={32} /></div>
                  <h4>No Priority Targets</h4>
                  <p>Assign high, medium, and low priority flags to start calibrating task throughput.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-accent-subtle)', opacity: 0.5 }} />
                    <Bar dataKey="count" fill="url(#colorPriority)" radius={[8, 8, 0, 0]} barSize={42} />
                    <defs>
                      <linearGradient id="colorPriority" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. RECENT OPERATIONAL ACTIVITY TABLE
            ========================================================= */}
        <section className="recent-activity-section">
          <div className="section-header">
            <h3>
              <Calendar size={24} weight="duotone" style={{ color: 'var(--primary)' }} />
              Recent Workspace Activity
            </h3>
            <Link to="/my-tasks" className="view-all-link">
              <span>View Full Repository</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="activity-table-container">
            {recentTasks.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No recent activity. Initiate your productivity workflow by adding your first task!</p>
              </div>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th style={{ textAlign: 'right' }}>Target Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="activity-row" onClick={() => window.location.href = '/my-tasks'}>
                      <td>{task.title}</td>
                      <td>
                        <span className={getStatusBadgeClass(task.status)}>
                          {task.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <span className={getPriorityChipClass(task.priority)}>
                          <Flag size={12} weight="fill" />
                          {task.priority || 'Medium'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '500' }}>
                        {formatDate(task.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}