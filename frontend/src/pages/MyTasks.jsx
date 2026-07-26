import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import API from "../services/api";
import { 
  MagnifyingGlass, Plus, PencilSimple, Trash, ArrowLeft, 
  Flag, Warning, Calendar, CheckCircle, XCircle, ListChecks, 
  Info, Stack, Sparkle, Clock, Lightning, Flame, Trophy
} from '@phosphor-icons/react';
import './PageStyles.css'; 

export default function MyTasks({ darkMode, toggleTheme }) {  
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); 
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dueDate');
  
  // --- STATE-OF-THE-ART LUXURY TOAST STATE ---
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });
  
  const today = new Date().toISOString().split('T')[0];
  
  // FORM STATE: Preserving 'desc' field precisely per Mongoose database schema
  const [formData, setFormData] = useState({ 
    title: '', 
    desc: '', 
    dueDate: today,  
    status: 'pending',
    priority: 'medium' 
  });

  // --- LUXURY TOAST NOTIFICATION TRIGGER ---
  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- FETCH TASK DATA ---
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks"); 
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToast("Sync Error", "Unable to synchronize workspace tasks from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- WORKSPACE STATS CALCULATION ---
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < todayDate;
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'progress').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  // --- NAVIGATION & FORM HELPERS ---
  const openAddTaskPage = () => {
    setEditingTask(null);
    resetForm();
    setView('form');
  };

  const openEditPage = (task) => {
    setEditingTask(task);
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : today;
    setFormData({
      title: task.title || '', 
      desc: task.desc || '', 
      dueDate: taskDate, 
      status: task.status || 'pending',
      priority: task.priority || 'medium'
    });
    setView('form');
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      desc: '', 
      dueDate: today,
      status: 'pending',
      priority: 'medium'
    });
  };

  const goBack = () => {
    setView('list');
    setEditingTask(null);
    resetForm();
  };

  // --- CRUD OPERATIONS ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        dueDate: formData.dueDate || today
      };

      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, dataToSend);
        showToast("Workflow Updated ⚡", "Your assignment changes have been synchronized to cloud storage.", "success");
      } else {
        await API.post("/tasks", dataToSend);
        showToast("Workflow Initialized 🚀", "New priority task has been activated in your workspace.", "success");
      }
      fetchTasks();
      goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      showToast("Operation Failed", "We encountered an error while saving your task. Please try again.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you wish to permanently archive this workflow item?')) {
      try {
        await API.delete(`/tasks/${id}`);
        showToast("Task Archived 🗑️", "The specified item has been permanently removed from your workspace.", "info");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        showToast("Deletion Failed", "Unable to remove this task right now. Please verify network status.", "error");
      }
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      const formattedStatus = newStatus === 'progress' ? '⚡ In Progress' : (newStatus === 'completed' ? '🚀 Completed' : '⏳ Pending');
      showToast("Status Shifted", `"${task.title}" progress transitioned to ${formattedStatus}.`, "success");
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Update Failed", "Unable to alter status right now.", "error");
    }
  };

  // --- FILTERING, SEARCHING & SORTING ---
  const processedTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const searchLower = search.toLowerCase();
      const matchesSearch = (task.title || '').toLowerCase().includes(searchLower) || 
                            (task.desc && task.desc.toLowerCase().includes(searchLower));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const map = { high: 3, medium: 2, low: 1 };
        return (map[b.priority || 'medium'] || 2) - (map[a.priority || 'medium'] || 2);
      }
      return 0;
    });

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        
        {/* =========================================================
            VIEW 1: FUTURISTIC WORKSPACE TASK DECK
            ========================================================= */}
        {view === 'list' && (
          <>
            {/* HERO ANALYTICS DECK */}
            <section className="workspace-hero-deck">
              <div className="hero-deck-left">
                <div className="hero-badge-pill">
                  <Lightning size={16} weight="fill" />
                  <span>Next-Gen Workspace & Milestone Suite</span>
                </div>
                <h1 className="hero-main-title">
                  Smart <span>Productivity Hub</span>
                </h1>
                <p>Monitor priority milestones, orchestrate team deliverables, and experience high-performance task execution.</p>
              </div>

              <div className="hero-deck-stats">
                <div className="kpi-pod pod-glow-cyan">
                  <span>In Progress</span>
                  <strong>{stats.inProgress}</strong>
                </div>
                <div className="kpi-pod pod-glow-red">
                  <span>Urgency</span>
                  <strong style={{ color: '#ef4444' }}>{stats.highPriority}</strong>
                </div>
                <div className="kpi-pod pod-glow-indigo">
                  <span>Completed</span>
                  <strong style={{ color: '#10b981' }}>{stats.completed}</strong>
                </div>
              </div>
            </section>

            {/* CONTROL HUB & FILTERS BAR */}
            <div className="controls-hub">
              
              <div className="search-studio">
                <MagnifyingGlass className="search-icon" weight="bold" />
                <input 
                  type="text" 
                  placeholder="Search assignments by headline or details..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              
              <div className="filter-studio-tabs">
                {[
                  { key: 'all', label: '🌟 All Tasks', count: tasks.length },
                  { key: 'pending', label: '⏳ Pending', count: tasks.filter(t=>t.status === 'pending').length },
                  { key: 'progress', label: '⚡ In Progress', count: tasks.filter(t=>t.status === 'progress').length },
                  { key: 'completed', label: '🚀 Completed', count: tasks.filter(t=>t.status === 'completed').length }
                ].map(tab => (
                  <button 
                    key={tab.key} 
                    className={`pill-tab ${filter === tab.key ? 'active' : ''}`}
                    onClick={() => setFilter(tab.key)}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="action-bar-right">
                <select 
                  className="studio-input" 
                  style={{ width: 'auto', minWidth: '150px', padding: '0.7rem 1rem', cursor: 'pointer', borderRadius: '12px', minHeight: '46px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  title="Sort task ordering"
                >
                  <option value="dueDate">📅 Sort: Due Date</option>
                  <option value="priority">🔥 Sort: Urgency</option>
                </select>

                <button className="btn-add-task-hero" onClick={openAddTaskPage} title="Initiate a new workflow assignment">
                  <Plus size={22} weight="extrabold" />
                  <span>Initiate Workflow</span>
                </button>
              </div>

            </div>

            {/* ULTRA-VIBRANT TASK CARDS GRID */}
            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a855f7', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Sparkle size={28} weight="fill" /> Synchronizing Workspace Hub...
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Establishing end-to-end encrypted connection with cloud databases.</p>
              </div>
            ) : (
              <div className="task-grid-premium">
                {processedTasks.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', padding: '5rem 2rem', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#fff', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.5)' }}>
                      <Lightning size={42} weight="fill" />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Workflows Found</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>Your workspace view is pristine! Initiate your first high-priority milestone or adjust your search parameters above.</p>
                    <button onClick={openAddTaskPage} className="btn-add-task-hero">
                      + Initiate New Assignment
                    </button>
                  </div>
                ) : (
                  processedTasks.map(task => {
                    const overdue = isOverdue(task);
                    const priorityValue = task.priority || 'medium';
                    const cardPriorityClass = `priority-${priorityValue}-card`;
                    const pillClass = `pill-${priorityValue}`;
                    
                    // Progress calculations
                    const statusVal = task.status || 'pending';
                    const fillClass = `fill-${statusVal}`;
                    
                    return (
                      <div key={task._id} className={`premium-card ${cardPriorityClass}`}>
                        
                        <div>
                          <div className="card-header-bar">
                            <h3 className="card-title-text">{task.title}</h3>
                            
                            <span className={`priority-pill ${pillClass}`}>
                              {priorityValue === 'high' && <Flame size={14} weight="fill" />}
                              {priorityValue === 'medium' && <Clock size={14} weight="bold" />}
                              {priorityValue === 'low' && <Info size={14} weight="bold" />}
                              <span>{priorityValue}</span>
                            </span>
                          </div>
                          
                          <p className="card-desc-body">
                            {task.desc || 'No specific technical guidelines or descriptions provided for this assignment.'}
                          </p>
                        </div>

                        <div>
                          {/* LIVE WORKFLOW PROGRESS TRACK */}
                          <div className="workflow-progress-section">
                            <div className="progress-header">
                              <span>Execution Stage</span>
                              <span>{statusVal === 'completed' ? '100% Finalized' : (statusVal === 'progress' ? '65% Active' : '15% Initiated')}</span>
                            </div>
                            <div className="progress-track">
                              <div className={`progress-fill ${fillClass}`}></div>
                            </div>
                          </div>

                          <div className="card-meta-footer">
                            <span className={`deadline-tag ${overdue ? 'overdue-tag' : ''}`} title="Target Deadline Date">
                              <Calendar size={16} weight="duotone" style={{ color: overdue ? '#ef4444' : '#8b5cf6' }} /> 
                              <span>
                                {overdue ? 'OVERDUE' : (task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date')}
                              </span>
                            </span>

                            <select 
                              className={`status-capsule capsule-${statusVal}`}
                              value={statusVal}
                              onChange={(e) => handleStatusChange(task, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              title="Click to change milestone stage"
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="progress">⚡ In Progress</option>
                              <option value="completed">🚀 Completed</option>
                            </select>

                            <div className="card-tools">
                              <button onClick={() => openEditPage(task)} className="btn-tool" title="Edit workspace assignment">
                                <PencilSimple size={18} weight="bold" />
                              </button>
                              <button onClick={() => handleDelete(task._id)} className="btn-tool delete-tool" title="Permanently archive task">
                                <Trash size={18} weight="bold" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* =========================================================
            VIEW 2: FUTURISTIC VISUAL STUDIO FORM (Add / Edit Task)
            ========================================================= */}
        {view === 'form' && (
          <div className="studio-form-wrapper">
            
            <div className="studio-form-card">
              
              <header className="studio-header">
                <button onClick={goBack} className="btn-back-studio" title="Cancel and return to workspace">
                  <ArrowLeft size={20} weight="bold" />
                  <span>Back</span>
                </button>

                <div className="studio-title-box">
                  <h2>{editingTask ? 'Edit Workspace Milestone' : 'Initiate New Milestone'}</h2>
                  <p>{editingTask ? 'Refine technical deliverables, due dates, and priority allocations.' : 'Configure milestone specifications with real-time suite synchronization.'}</p>
                </div>
              </header>

              <form onSubmit={handleSave} className="studio-fields-stack">
                
                <div className="studio-group">
                  <label htmlFor="task-title-studio">
                    <Sparkle size={18} weight="fill" style={{ color: '#a855f7' }} />
                    Milestone Headline
                  </label>
                  <input 
                    id="task-title-studio"
                    className="studio-input" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="e.g., Q3 Cloud Database Scalability & Performance Tuning"
                  />
                </div>

                <div className="studio-group">
                  <label htmlFor="task-desc-studio">
                    <Info size={18} weight="fill" style={{ color: '#3b82f6' }} />
                    Workflow Deliverables & Technical Notes
                  </label>
                  <textarea 
                    id="task-desc-studio"
                    className="studio-input" 
                    rows="4"
                    style={{ lineHeight: '1.6', resize: 'vertical' }}
                    value={formData.desc} 
                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                    placeholder="Provide actionable checklist criteria, team responsibilities, or architecture references..."
                    required 
                  />
                </div>

                <div className="studio-group">
                  <label htmlFor="task-date-studio">
                    <Calendar size={18} weight="fill" style={{ color: '#ec4899' }} />
                    Target Completion Date
                  </label>
                  <input 
                    id="task-date-studio"
                    type="date" 
                    className="studio-input" 
                    style={{ maxWidth: '280px' }}
                    value={formData.dueDate} 
                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                    required 
                  />
                </div>

                {/* VISUAL URGENCY SELECTOR TILES (No boring dropdowns!) */}
                <div className="studio-group">
                  <label>
                    <Flame size={18} weight="fill" style={{ color: '#f97316' }} />
                    Urgency Allocation
                  </label>
                  <div className="visual-options-grid">
                    {[
                      { val: 'low', label: '🟢 Low Urgency', sub: 'Standard timeline' },
                      { val: 'medium', label: '🟡 Medium Priority', sub: 'Active deliverable' },
                      { val: 'high', label: '🔴 High Priority', sub: 'Immediate action' }
                    ].map(opt => (
                      <div 
                        key={opt.val}
                        className={`option-card-btn ${formData.priority === opt.val ? 'selected-option' : ''}`}
                        onClick={() => setFormData({...formData, priority: opt.val})}
                      >
                        <span>{opt.label}</span>
                        <small style={{ fontSize: '0.78rem', opacity: 0.8 }}>{opt.sub}</small>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VISUAL STATUS SELECTOR TILES */}
                <div className="studio-group">
                  <label>
                    <Lightning size={18} weight="fill" style={{ color: '#06b6d4' }} />
                    Initial Execution Stage
                  </label>
                  <div className="visual-options-grid">
                    {[
                      { val: 'pending', label: '⏳ Pending', sub: 'Not started yet' },
                      { val: 'progress', label: '⚡ In Progress', sub: 'Work underway' },
                      { val: 'completed', label: '🚀 Completed', sub: 'Ready for review' }
                    ].map(opt => (
                      <div 
                        key={opt.val}
                        className={`option-card-btn ${formData.status === opt.val ? 'selected-option' : ''}`}
                        onClick={() => setFormData({...formData, status: opt.val})}
                      >
                        <span>{opt.label}</span>
                        <small style={{ fontSize: '0.78rem', opacity: 0.8 }}>{opt.sub}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="studio-footer">
                  <button type="button" onClick={goBack} className="btn-studio-cancel">
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-studio-submit">
                    <Lightning size={22} weight="fill" />
                    <span>{editingTask ? 'Synchronize Updates ⚡' : 'Deploy Milestone 🚀'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            STATE-OF-THE-ART LUXURY GLASS TOAST SYSTEM
            ========================================================= */}
        {toast.show && (
          <div className="luxury-toast">
            <div className={`toast-badge-icon toast-${toast.type}-badge`}>
              {toast.type === 'success' && <CheckCircle size={24} weight="fill" />}
              {toast.type === 'error' && <XCircle size={24} weight="fill" />}
              {toast.type === 'info' && <Info size={24} weight="fill" />}
            </div>
            
            <div className="toast-details">
              <h4>{toast.title || (toast.type === 'error' ? 'System Alert' : 'Success')}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}