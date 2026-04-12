import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import API from "../services/api";
import { 
  MagnifyingGlass, Plus, PencilSimple, Trash, ArrowLeft, 
  Flag, Warning, Calendar, CheckCircle, XCircle 
} from '@phosphor-icons/react';
// import './Dashboard.css';
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
  
  // --- TOAST STATE ---
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const today = new Date().toISOString().split('T')[0];
  
  // FORM STATE: Schema ke hisaab se 'desc' use kiya hai
  const [formData, setFormData] = useState({ 
    title: '', 
    desc: '', // Schema Field: 'desc'
    dueDate: today,  
    status: 'pending',
    priority: 'medium' 
  });

  // --- TOAST FUNCTION ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- FETCH DATA ---
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks"); 
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- NAVIGATION ACTIONS ---
  const openAddTaskPage = () => {
    setEditingTask(null);
    resetForm();
    setView('form');
  };

  const openEditPage = (task) => {
    setEditingTask(task);
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : today;
    setFormData({
      title: task.title, 
      desc: task.desc || '', // Schema field 'desc'
      dueDate: taskDate, 
      status: task.status,
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
        showToast("Task updated successfully!");
      } else {
        await API.post("/tasks", dataToSend);
        showToast("Task created successfully!");
      }
      fetchTasks();
      goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      showToast("Failed to save task.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        showToast("Task deleted successfully!");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        showToast("Failed to delete task.", "error");
      }
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      showToast("Status updated!");
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status.", "error");
    }
  };

  // --- HELPERS ---
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    const due = new Date(task.dueDate);
    return due < todayDate;
  };

  // --- FILTERING, SEARCHING & SORTING ---
  const processedTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const searchLower = search.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(searchLower) || 
                            (task.desc && task.desc.toLowerCase().includes(searchLower)); // Search in 'desc'
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const map = { high: 3, medium: 2, low: 1 };
        return map[b.priority] - map[a.priority];
      }
      return 0;
    });

  return (
  <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        
        {/* VIEW: LIST MODE */}
        {view === 'list' && (
          <>
            {/* CONTROLS */}
            <div className="controls-area">
              <div className="search-filters-row">
                <div className="search-bar" style={{flex: 1}}>
                  <MagnifyingGlass size={20} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                  />
                </div>
                
                <div className="filter-tabs">
                  {['all', 'pending', 'progress', 'completed'].map(f => (
                    <button 
                      key={f} 
                      className={`filter-tab ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>

                <select 
                  className="form-control" 
                  style={{width: 'auto'}}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="dueDate">Sort: Date</option>
                  <option value="priority">Sort: Priority</option>
                </select>

                <button className="btn-primary" onClick={openAddTaskPage}>
                  <Plus size={20} weight="bold" /> Add Task
                </button>
              </div>
            </div>

            {/* TASK LIST */}
            {loading ? (
              <div className="loading-state">Loading your tasks...</div>
            ) : (
              <div className="task-list">
                {processedTasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No tasks found matching your criteria.</p>
                    <button onClick={openAddTaskPage} className="btn-link">Create a new task</button>
                  </div>
                ) : (
                  processedTasks.map(task => {
                    const overdue = isOverdue(task);
                    return (
                      <div key={task._id} className={`task-card ${task.status} ${overdue ? 'overdue' : ''}`}>
                        <div className="task-content">
                          <div className="task-header-row">
                            <h3>{task.title}</h3>
                            <span className={`priority-badge priority-${task.priority}`}>
                              <Flag size={12} weight="fill" />
                              {task.priority}
                            </span>
                          </div>
                          <p>{task.desc}</p> {/* Display 'desc' */}
                          
                          <div className="task-meta">
                            <span className="meta-date">
                              <Calendar size={14} /> {task.dueDate ? task.dueDate.split('T')[0] : 'No Date'}
                            </span>
                            {overdue && (
                              <span className="overdue-text">
                                <Warning size={14} weight="fill" /> Overdue
                              </span>
                            )}
                            
                            <select 
                              className={`status-badge badge-${task.status}`}
                              value={task.status}
                              onChange={(e) => handleStatusChange(task, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="pending">Pending</option>
                              <option value="progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button onClick={() => openEditPage(task)} className="action-btn" title="Edit">
                            <PencilSimple size={18} />
                          </button>
                          <button onClick={() => handleDelete(task._id)} className="action-btn btn-delete" title="Delete">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* VIEW: FORM MODE (Add/Edit) */}
        {view === 'form' && (
          <div className="page-form-container">
            <header className="top-header" style={{borderBottom: '1px solid var(--border)', padding: '0 0 1rem 0', marginBottom: '1rem'}}>
               <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={goBack} className="back-btn">
                  <ArrowLeft size={20} weight="bold" /><span>Back to List</span>
                </button>
                <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              </div>
            </header>

            <form onSubmit={handleSave} className="large-form">
              <div className="form-section">
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    className="form-control large-input" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="e.g., Q3 Financial Report"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control large-input" 
                    rows="5"
                    value={formData.desc} // Use 'desc' state
                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                    placeholder="Add a detailed description..."
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={formData.dueDate} 
                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    className="form-control"
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    className="form-control"
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-footer">
                <button type="button" onClick={goBack} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary large-btn">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TOAST NOTIFICATION COMPONENT --- */}
        {toast.show && (
          <div className={`toast-notification toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
            <span>{toast.message}</span>
          </div>
        )}

      </div>
    </Layout>
  );
}