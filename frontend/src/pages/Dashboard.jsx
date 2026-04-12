// import React, { useState, useEffect } from 'react';
// import { 
//   CheckSquareOffset, SquaresFour, ListChecks, Calendar, 
//   Gear, SignOut, MagnifyingGlass, Moon, Sun, Bell, 
//   Stack, Hourglass, CheckCircle, Plus, PencilSimple, Trash, ArrowLeft, 
//   Flag, Warning 
// } from '@phosphor-icons/react';
// import API from "../services/api"; 
// import { useAuth } from "../context/AuthContext"; 
// import './Dashboard.css';

// export default function Dashboard() {
//   const { user, darkMode, toggleTheme, logout } = useAuth();
  
//   // --- STATE MANAGEMENT ---
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState('all'); // all, pending, progress, completed
//   const [search, setSearch] = useState('');
//   const [currentView, setCurrentView] = useState('dashboard'); 
//   const [editingTask, setEditingTask] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // FIX: Default to TODAY for new tasks
//   const today = new Date().toISOString().split('T')[0];
  
//   // Form State matches your NEW Schema
//   const [formData, setFormData] = useState({ 
//     title: '', 
//     description: '', // Matches Schema 'description'
//     dueDate: today,  // Matches Schema 'dueDate'
//     status: 'pending',
//     priority: 'medium' // Matches Schema 'priority'
//   });

//   // --- FETCH DATA ---
//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/tasks"); 
//       setTasks(res.data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // --- NAVIGATION ACTIONS ---
//   const openAddTaskPage = () => {
//     setEditingTask(null);
//     setFormData({ 
//       title: '', 
//       description: '', 
//       dueDate: new Date().toISOString().split('T')[0],
//       status: 'pending',
//       priority: 'medium'
//     });
//     setCurrentView('form');
//   };

//   const openEditPage = (task) => {
//     setEditingTask(task);
//     // Handle date safely for input type="date"
//     const taskDate = task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0];
    
//     setFormData({
//       title: task.title, 
//       description: task.description,
//       dueDate: taskDate, 
//       status: task.status,
//       priority: task.priority || 'medium'
//     });
//     setCurrentView('form');
//   };

//   const goBackToDashboard = () => {
//     setCurrentView('dashboard');
//     setEditingTask(null);
//   };

//   // --- CRUD OPERATIONS ---
//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       // Ensure data matches Schema
//       const dataToSend = {
//         ...formData,
//         dueDate: formData.dueDate || new Date().toISOString().split('T')[0]
//       };

//       if (editingTask) {
//         await API.put(`/tasks/${editingTask._id}`, dataToSend);
//       } else {
//         await API.post("/tasks", dataToSend);
//       }
//       fetchTasks();
//       goBackToDashboard();
//     } catch (error) {
//       console.error("Error saving task:", error);
//       alert("Failed to save task. Please try again.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         await API.delete(`/tasks/${id}`);
//         fetchTasks();
//       } catch (error) {
//         console.error("Error deleting task:", error);
//       }
//     }
//   };

//   // --- HELPER: CHECK OVERDUE ---
//   const isOverdue = (task) => {
//     if (!task.dueDate || task.status === 'completed') return false;
//     const today = new Date();
//     today.setHours(0,0,0,0);
//     const due = new Date(task.dueDate);
//     return due < today;
//   };

//   // --- FILTERING & SEARCHING ---
//   const filteredTasks = tasks.filter(task => {
//     // 1. Filter by Status
//     const matchesFilter = filter === 'all' || task.status === filter;
    
//     // 2. Search by Title
//     const searchLower = search.toLowerCase();
//     const matchesSearch = task.title.toLowerCase().includes(searchLower) || 
//                           (task.description && task.description.toLowerCase().includes(searchLower));
    
//     return matchesFilter && matchesSearch;
//   });

//   const stats = {
//     total: tasks.length,
//     pending: tasks.filter(t => t.status === 'pending').length,
//     progress: tasks.filter(t => t.status === 'progress').length,
//     completed: tasks.filter(t => t.status === 'completed').length,
//   };

//   return (
//     <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="logo">
//           <CheckSquareOffset size={28} weight="bold" />
//           <span>TaskMaster</span>
//         </div>
        
//         <nav className="nav-menu">
//           <div className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} onClick={goBackToDashboard}>
//             <SquaresFour size={22} /> Dashboard
//           </div>
//           <div className="nav-link">
//             <ListChecks size={22} /> My Tasks
//           </div>
//           <div className="nav-link">
//             <Calendar size={22} /> Calendar
//           </div>
//           <div className="nav-link">
//             <Gear size={22} /> Settings
//           </div>
//         </nav>

//         <div className="user-profile">
//           <img 
//             src={`https://picsum.photos/seed/${user?.id || 'user'}/100/100`} 
//             alt="User" 
//             className="avatar" 
//           />
//           <div className="user-info">
//             <h4>{user?.name || 'User'}</h4>
//             <p>{user?.role || 'Member'}</p>
//           </div>
//           <SignOut size={20} onClick={logout} className="logout-icon" />
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         {/* HEADER */}
//         {currentView === 'dashboard' ? (
//           <header className="top-header">
//             <div className="header-left">
//               <h2>Dashboard</h2>
//               <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
//             </div>
//             <div className="header-right">
//               <div className="search-bar">
//                 <MagnifyingGlass size={20} className="search-icon" />
//                 <input 
//                   type="text" 
//                   placeholder="Search tasks..." 
//                   value={search} 
//                   onChange={(e) => setSearch(e.target.value)} 
//                 />
//               </div>
//               <button className="icon-btn" onClick={toggleTheme}>
//                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//               <button className="icon-btn"><Bell size={20} /></button>
//             </div>
//           </header>
//         ) : (
//           <header className="top-header" style={{ borderBottom: '1px solid var(--border)' }}>
//             <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <button onClick={goBackToDashboard} className="back-btn">
//                 <ArrowLeft size={20} weight="bold" /><span>Back</span>
//               </button>
//               <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
//               <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
//             </div>
//           </header>
//         )}

//         <div className="content-scroll">
          
//           {/* VIEW: DASHBOARD LIST */}
//           {currentView === 'dashboard' && (
//             <>
//               {/* STATS */}
//               <div className="stats-grid">
//                 <div className="stat-card">
//                   <div className="stat-icon icon-blue"><Stack size={24} /></div>
//                   <div><h3>{stats.total}</h3><p>Total Tasks</p></div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-icon icon-yellow"><Hourglass size={24} /></div>
//                   <div><h3>{stats.pending + stats.progress}</h3><p>Pending</p></div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-icon icon-green"><CheckCircle size={24} /></div>
//                   <div><h3>{stats.completed}</h3><p>Completed</p></div>
//                 </div>
//               </div>

//               {/* CONTROLS: FILTER + ADD BUTTON */}
//               <div className="controls-area">
//                 <div className="filter-tabs">
//                   {['all', 'pending', 'progress', 'completed'].map(f => (
//                     <button 
//                       key={f} 
//                       className={`filter-tab ${filter === f ? 'active' : ''}`}
//                       onClick={() => setFilter(f)}
//                     >
//                       {f.charAt(0).toUpperCase() + f.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//                 <button className="btn-primary" onClick={openAddTaskPage}>
//                   <Plus size={20} weight="bold" /> Add Task
//                 </button>
//               </div>

//               {/* TASK LIST */}
//               {loading ? (
//                  <div className="loading-state">Loading your tasks...</div>
//               ) : (
//                 <div className="task-list">
//                   {filteredTasks.length === 0 ? (
//                     <div className="empty-state">
//                       <Stack size={48} />
//                       <p>No tasks found.</p>
//                     </div>
//                   ) : (
//                     filteredTasks.map(task => {
//                       const overdue = isOverdue(task);
//                       return (
//                         <div key={task._id} className={`task-card ${task.status} ${overdue ? 'overdue' : ''}`}>
//                           <div className="task-content">
//                             <div className="task-header-row">
//                               <h3>{task.title}</h3>
//                               {/* PRIORITY BADGE */}
//                               <span className={`priority-badge priority-${task.priority}`}>
//                                 <Flag size={12} weight="fill" />
//                                 {task.priority}
//                               </span>
//                             </div>
//                             <p>{task.description}</p>
                            
//                             <div className="task-meta">
//                               {/* DATE DISPLAY */}
//                               <span className="meta-date">
//                                 <Calendar size={14} /> 
//                                 {task.dueDate ? task.dueDate.split('T')[0] : 'No Date'}
//                               </span>
                              
//                               {/* OVERDUE WARNING */}
//                               {overdue && (
//                                 <span className="overdue-text">
//                                   <Warning size={14} weight="fill" /> Overdue
//                                 </span>
//                               )}

//                               <span className={`status-badge badge-${task.status}`}>
//                                 {task.status}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="task-actions">
//                             <button onClick={() => openEditPage(task)} className="action-btn"><PencilSimple size={18} /></button>
//                             <button onClick={() => handleDelete(task._id)} className="action-btn btn-delete"><Trash size={18} /></button>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               )}
//             </>
//           )}

//           {/* VIEW: FORM */}
//           {currentView === 'form' && (
//             <div className="page-form-container">
//               <form onSubmit={handleSave} className="large-form">
//                 <div className="form-section">
//                   <label className="section-label">Task Details</label>
                  
//                   <div className="form-group">
//                     <label>Title</label>
//                     <input 
//                       className="form-control large-input" 
//                       value={formData.title} 
//                       onChange={e => setFormData({...formData, title: e.target.value})} 
//                       required 
//                       placeholder="e.g., Q3 Financial Report"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Description</label>
//                     <textarea 
//                       className="form-control large-input" 
//                       rows="6"
//                       value={formData.description} 
//                       onChange={e => setFormData({...formData, description: e.target.value})} 
//                       placeholder="Add a detailed description..."
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Due Date</label>
//                     <input 
//                       type="date" 
//                       className="form-control" 
//                       value={formData.dueDate} 
//                       onChange={e => setFormData({...formData, dueDate: e.target.value})} 
//                       required 
//                     />
//                   </div>
                  
//                   {/* NEW: PRIORITY SELECTOR */}
//                   <div className="form-group">
//                     <label>Priority</label>
//                     <select 
//                       className="form-control"
//                       value={formData.priority} 
//                       onChange={e => setFormData({...formData, priority: e.target.value})}
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>

//                   <div className="form-group">
//                     <label>Status</label>
//                     <select 
//                       className="form-control"
//                       value={formData.status} 
//                       onChange={e => setFormData({...formData, status: e.target.value})}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="progress">In Progress</option>
//                       <option value="completed">Completed</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" onClick={goBackToDashboard} className="btn-secondary">Cancel</button>
//                   <button type="submit" className="btn-primary large-btn">
//                     {editingTask ? 'Update Task' : 'Create Task'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import Layout from './Layout'; // Make sure this path is correct
import API from "../services/api";
import { Stack, Hourglass, CheckCircle, TrendUp } from '@phosphor-icons/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// 1. ADD PROPS HERE
export default function Dashboard({ darkMode, toggleTheme }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks"); 
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const statusData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.progress },
    { name: 'Completed', value: stats.completed },
  ].filter(item => item.value > 0);

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = [
    { name: 'Low', count: priorityCounts.low || 0 },
    { name: 'Medium', count: priorityCounts.medium || 0 },
    { name: 'High', count: priorityCounts.high || 0 },
  ];

  return (
    // 2. PASS PROPS TO LAYOUT HERE
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      {loading ? (
        <div className="loading-state">Loading Dashboard...</div>
      ) : (
        <div className="dashboard-view">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue"><Stack size={24} /></div>
              <div><h3>{stats.total}</h3><p>Total Tasks</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-yellow"><Hourglass size={24} /></div>
              <div><h3>{stats.pending + stats.progress}</h3><p>Pending</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-green"><CheckCircle size={24} /></div>
              <div><h3>{stats.completed}</h3><p>Completed</p></div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3><TrendUp size={20} /> Task Status</h3>
              <div style={{ width: '100%', height: 300 }}> {/* Wrapper for safety */}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} (${entry.value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3><TrendUp size={20} /> Priority Distribution</h3>
              <div style={{ width: '100%', height: 300 }}> {/* Wrapper for safety */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}