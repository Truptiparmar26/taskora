import React, { useState, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SquaresFour, ListChecks, Note as NoteIcon, User, SignOut, 
  Sun, Moon, Bell, List, CheckCircle, BellSlash, WarningCircle 
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext'; 
import TaskoraLogo from '../components/TaskoraLogo'; 
import API from '../services/api'; 
import './Dashboard.css'; 

export default function Layout({ children, darkMode, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch Real Notifications Logic
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const [tasksRes, notesRes] = await Promise.all([
          API.get("/tasks"), 
          API.get("/notes")
        ]);

        const tasks = tasksRes.data;
        const notes = notesRes.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        // LOGIC 1: Find Overdue Tasks
        const overdueTasks = tasks
          .filter(task => {
            const dueDate = new Date(task.dueDate);
            return task.dueDate && dueDate < today && task.status !== 'completed';
          })
          .map(task => ({
            id: task._id,
            text: `Overdue Task: ${task.title}`,
            time: new Date(task.dueDate).toLocaleDateString(),
            type: 'danger', 
            link: '/my-tasks'
          }));

        // LOGIC 2: Find Recently Created Notes (Last 24 hours)
        const recentNotes = notes
          .filter(note => {
            const createdAt = new Date(note.createdAt);
            const diffTime = Math.abs(today - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 1;
          })
          .map(note => ({
            id: note._id,
            text: `New Note: ${note.title || 'Untitled'}`,
            time: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'info', 
            link: '/mynotes'
          }));

        setNotifications([...overdueTasks, ...recentNotes]);
      } catch (error) {
        console.error("Error fetching active notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false); 
    setToast({ show: true, message: 'Logged out successfully from workspace.', type: 'success' });
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { name: 'My Tasks', path: '/my-tasks', icon: ListChecks },
    { name: 'My Notes', path: '/mynotes', icon: NoteIcon },
    { name: 'Profile Studio', path: '/profile', icon: User },
  ];

  const getInitial = () => {
    if (!user) return 'U';
    const name = user.name || user.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      
      {/* Mobile Drawer Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Navigation Sidebar Drawer */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <TaskoraLogo size={36} />
          <span>Taskora</span>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconComponent size={22} weight={isActive ? "fill" : "bold"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity Footer */}
        <div className="sidebar-profile">
          <div className="avatar-container" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            {user && user.img ? (
              <img src={user.img} alt="User Avatar" className="avatar" />
            ) : (
              <div className="avatar-placeholder">{getInitial()}</div>
            )}
          </div>

          <div className="user-info" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', flex: 1 }}>
            <h4>{user ? user.name : 'Guest User'}</h4>
            <p>{user ? user.email : 'authenticated@workspace.dev'}</p>
          </div>

          <button onClick={handleLogout} className="logout-icon-btn" title="Logout from Workspace">
            <SignOut size={20} weight="bold" />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace Deck */}
      <div className="main-content">
        
        {/* Top Header Command Bar */}
        <header className="top-header">
          <div className="header-left">
            <button className="icon-btn hamburger-btn" onClick={toggleSidebar} title="Open navigation menu">
              <List size={22} weight="bold" />
            </button>

            <div className="header-title-box">
              <h2>{menuItems.find(item => item.path === location.pathname)?.name || 'Executive Command'}</h2>
              <p>Welcome back, <strong>{user?.name || 'Executive'}</strong>. Here is your operational overview.</p>
            </div>
          </div>

          <div className="header-right">
            {/* Dark Mode Theme Switcher */}
            <button className="icon-btn" onClick={toggleTheme} title="Toggle visual theme">
              {darkMode ? <Sun size={22} weight="bold" style={{ color: '#F59E0B' }} /> : <Moon size={22} weight="bold" style={{ color: '#6366F1' }} />}
            </button>

            {/* Live Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={toggleNotifications} title="View workspace activity alerts">
                <Bell size={22} weight="bold" />
                {notifications.length > 0 && <span className="notif-badge"></span>}
              </button>

              {/* Notification Popover Box */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '56px',
                  width: '340px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  padding: '1.25rem',
                  zIndex: 100,
                  maxHeight: '420px',
                  overflowY: 'auto',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Active Alerts ({notifications.length})</span>
                    <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}>
                      Clear All
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                      <BellSlash size={32} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>No urgent pending notifications.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.map((notif, index) => (
                        <div key={index} onClick={() => { navigate(notif.link); setShowNotifications(false); }} style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-body)',
                          borderLeft: `3px solid ${notif.type === 'danger' ? '#ef4444' : '#3b82f6'}`,
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}>
                          {notif.type === 'danger' ? <WarningCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} /> : <Bell size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{notif.text}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Deck */}
        <div className="content-scroll" onClick={() => setShowNotifications(false)}>
          {children}
        </div>

        {/* Global Toast Notification Capsule */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '16px 24px',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            <CheckCircle size={24} color="#10b981" weight="fill" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
