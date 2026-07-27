import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Trash, CheckCircle, Hourglass, Stack, Calendar, Flag, 
  MagnifyingGlass, Funnel, Clock, Tag, PencilSimple, ArrowDown, 
  X, Sparkle, Check, WarningCircle
} from '@phosphor-icons/react';
import './PageStyles.css';

export default function MyTasks({ darkMode, toggleTheme }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all | pending | in-progress | completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all | Low | Medium | High
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for New / Edit Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'pending'
  });

  const { showToast } = useAuth();
  const triggerToast = showToast || ((msg) => console.log(msg));

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      triggerToast("Unable to synchronize with task server.", "Connection Alert", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openNewTaskModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'pending' });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingId(task._id);
    const dateStr = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    setFormData({
      title: task.title || '',
      description: task.description || '',
      dueDate: dateStr,
      priority: task.priority || 'Medium',
      status: task.status || 'pending'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, formData);
        triggerToast("Task parameters successfully revised & synchronized.", "Task Calibrated ⚡", "success");
      } else {
        await API.post("/tasks", formData);
        triggerToast("New target milestone deployed to repository.", "Milestone Initiated 🚀", "success");
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      const errMsg = error.response?.data?.msg || error.response?.data?.message || "Could not process task modifications.";
      triggerToast(errMsg, "Operation Failed", "error");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      triggerToast(`Milestone marked as '${newStatus.toUpperCase()}'.`, "Workflow Updated ⚡", "info");
      fetchTasks();
    } catch (err) {
      triggerToast("Status synchronization failed.", "Sync Warning", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      triggerToast("Task permanently purged from repository.", "Target Terminated 🗑️", "error");
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      triggerToast("Failed to terminate task record.", "Delete Error", "error");
    }
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filter === 'all' || task.status === filter;
    const matchesPriority = priorityFilter === 'all' || (task.priority && task.priority.toLowerCase() === priorityFilter.toLowerCase());
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high') return 'chip-high';
    if (p === 'medium') return 'chip-medium';
    return 'chip-low';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Deadline';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        
        {/* =========================================================
            1. WORKSPACE COMMAND DECK HERO
            ========================================================= */}
        <section className="workspace-hero-deck">
          <div className="hero-deck-left">
            <div className="deck-tag-pill">
              <Sparkle size={16} weight="fill" />
              <span>Target Management Studio</span>
            </div>
            <h1 className="deck-title">
              Active <span>Milestones & Goals</span>
            </h1>
            <p className="deck-subtitle">
              Prioritize deliverables, manage agile status progression, and calibrate personal workflow velocity.
            </p>
          </div>

          <div className="hero-deck-stats">
            <div className="mini-stat-card">
              <span className="mini-label">Total Repository</span>
              <strong className="mini-val">{tasks.length}</strong>
            </div>
            <div className="mini-stat-card">
              <span className="mini-label">Pending Action</span>
              <strong className="mini-val text-amber">{tasks.filter(t => t.status !== 'completed').length}</strong>
            </div>
            <div className="mini-stat-card">
              <span className="mini-label">Hit Rate</span>
              <strong className="mini-val text-emerald">
                {tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
              </strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. INTERACTIVE CONTROLS & FILTER HUB
            ========================================================= */}
        <section className="controls-hub">
          <div className="search-studio">
            <MagnifyingGlass size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search target title or execution scope..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="action-bar-right">
            <div className="filter-studio-tabs">
              <button className={`tab-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                All Targets
              </button>
              <button className={`tab-pill ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
                Pending
              </button>
              <button className={`tab-pill ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => setFilter('in-progress')}>
                In-Progress
              </button>
              <button className={`tab-pill ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
                Completed
              </button>
            </div>

            <button className="btn-deploy-task" onClick={openNewTaskModal}>
              <Plus size={20} weight="bold" />
              <span>Initiate Target</span>
            </button>
          </div>
        </section>

        {/* =========================================================
            3. LUXURY TASK GRID PORTAL
            ========================================================= */}
        <div className="task-grid-premium">
          {filteredTasks.length === 0 ? (
            <div className="no-targets-state">
              <Stack size={48} className="no-targets-icon" />
              <h3>No Matching Targets Discovered</h3>
              <p>Try refining your search vocabulary or click 'Initiate Target' to commission a new operational goal.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className={`task-pod ${task.status}`}>
                
                {/* POD TOP SECTION */}
                <div className="pod-header">
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    <Flag size={13} weight="fill" />
                    {task.priority || 'Medium'}
                  </span>

                  <div className="pod-quick-actions">
                    <button onClick={() => openEditModal(task)} className="icon-action-btn edit-btn" title="Edit task details">
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="icon-action-btn del-btn" title="Purge target from repository">
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* POD BODY SECTION */}
                <div className="pod-body">
                  <h3 className="pod-title">{task.title}</h3>
                  {task.description && (
                    <p className="pod-desc">{task.description}</p>
                  )}
                </div>

                {/* POD FOOTER SECTION */}
                <div className="pod-footer">
                  <div className="pod-meta">
                    <Clock size={16} weight="bold" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>

                  <div className="pod-status-controls">
                    <select 
                      value={task.status || 'pending'} 
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className={`status-selector select-${task.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* =========================================================
            4. DEPLOY TARGET MODAL DIALOGUE
            ========================================================= */}
        {isModalOpen && (
          <div className="modal-portal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal-command-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-line">
                <h3>{editingId ? "Calibrate Milestone" : "Initiate Target Milestone"}</h3>
                <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={22} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-studio-form">
                <div className="form-group-item">
                  <label>Target Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter actionable target title..." 
                    required 
                  />
                </div>

                <div className="form-group-item">
                  <label>Operational Scope (Description)</label>
                  <textarea 
                    rows="3" 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Define execution notes and acceptance criteria..."
                  ></textarea>
                </div>

                <div className="form-row-twin">
                  <div className="form-group-item">
                    <label>Target Deadline</label>
                    <input 
                      type="date" 
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>Priority Flag</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low Priority 🔵</option>
                      <option value="Medium">Medium Priority 🟡</option>
                      <option value="High">High Priority 🔴</option>
                    </select>
                  </div>
                </div>

                <div className="modal-form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-studio">
                    <Sparkle size={18} weight="fill" />
                    <span>{editingId ? "Save Revisions ⚡" : "Deploy Target 🚀"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}