import React, { useState, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SquaresFour, ListChecks, 
  User, SignOut, Sun, Moon, Bell, List, CheckCircle, Note as NoteIcon, BellSlash, WarningCircle 
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

  // --- Notification States ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // LocalStorage persistant clearing check
  const [lastClearedAt, setLastClearedAt] = useState(() => {
    const saved = localStorage.getItem('taskora_notif_cleared');
    return saved ? new Date(saved) : null;
  });

  // --- FETCH REAL NOTIFICATIONS LOGIC ---
  useEffect(() => {
    const fetchNotifications = async () => {
      if(!user) return;

      try {
        const [tasksRes, notesRes] = await Promise.all([
          API.get("/tasks"), 
          API.get("/notes")
        ]);

        const tasks = tasksRes.data || [];
        const notes = notesRes.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        // 1. Overdue Tasks
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

        // 2. Recent Notes (24h rule & check cleared status)
        const recentNotes = notes
          .filter(note => {
            if (!note.createdAt) return false;
            const createdAt = new Date(note.createdAt);
            const diffTime = Math.abs(today - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays > 1) return false;

            if (lastClearedAt) {
              const clearTime = new Date(lastClearedAt);
              if (createdAt <= clearTime) return false; 
            }
            return true;
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
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user, lastClearedAt]); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = () => {
    const now = new Date();
    setNotifications([]); 
    setLastClearedAt(now); 
    localStorage.setItem('taskora_notif_cleared', now.toISOString()); 
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false); 
    setToast({ show: true, message: 'Logged out successfully', type: 'success' });
    setTimeout(() => {
      navigate('/');
      setToast({ show: false, message: '', type: '' });
    }, 1500);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Determine Page Title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/my-tasks': return 'My Tasks Workspace';
      case '/mynotes': return 'My Notes & Ideas';
      case '/profile': return 'Account Settings';
      default: return 'Taskora Enterprise';
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <TaskoraLogo size={34} />
          <span>Taskora</span>
        </div>
        
        <nav className="nav-menu">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <SquaresFour size={22} weight={location.pathname === '/dashboard' ? "fill" : "regular"} /> 
            <span>Dashboard</span>
          </Link>

          <Link to="/my-tasks" className={`nav-link ${location.pathname === '/my-tasks' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <ListChecks size={22} weight={location.pathname === '/my-tasks' ? "fill" : "regular"} /> 
            <span>My Tasks</span>
          </Link>

          <Link to="/mynotes" className={`nav-link ${location.pathname === '/mynotes' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <NoteIcon size={22} weight={location.pathname === '/mynotes' ? "fill" : "regular"} /> 
            <span>MyNotes</span>
          </Link>

          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <User size={22} weight={location.pathname === '/profile' ? "fill" : "regular"} /> 
            <span>Profile</span>
          </Link>
        </nav>

        {/* BOTTOM USER PROFILE CARD */}
        <div className="sidebar-profile">
          <div className="avatar-container">
            {user?.img ? (
              <img src={user.img} alt="User Avatar" className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="user-info">
            <h4>{user?.name || 'Authorized User'}</h4>
            <p>{user?.email || 'member@taskora.io'}</p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="logout-icon-btn"
            title="Sign Out"
          >
            <SignOut size={20} weight="bold" />
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="icon-btn hamburger-btn" onClick={toggleSidebar} title="Open Sidebar">
              <List size={24} weight="bold" />
            </button>

            <div className="header-title-box">
              <h2>{getPageTitle()}</h2>
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="header-right">
            {/* Theme Switcher Button */}
            <button 
              className="icon-btn" 
              onClick={toggleTheme} 
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={22} weight="fill" style={{ color: '#F59E0B' }} /> : <Moon size={22} weight="bold" style={{ color: '#4338CA' }} />}
            </button>

            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                onClick={toggleNotifications}
                title="Notifications & Reminders"
              >
                <Bell size={22} weight={showNotifications ? "fill" : "bold"} />
                {notifications.length > 0 && <span className="notif-badge"></span>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notif-header">
                    <h4>Active Reminders</h4>
                    <span className="mark-read" onClick={handleClearNotifications}>Clear All</span>
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <BellSlash size={32} weight="thin" />
                        <p>No new alerts or reminders</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <Link 
                          key={notif.id} 
                          to={notif.link} 
                          className="notif-item"
                          onClick={() => setShowNotifications(false)}
                        >
                          <div className={`notif-icon-wrap ${notif.type}`}>
                            {notif.type === 'danger' ? <WarningCircle size={20} weight="fill" /> : <Bell size={20} weight="fill" />}
                          </div>
                          <div className="notif-content">
                            <p>{notif.text}</p>
                            <span className="notif-time">{notif.time}</span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-scroll">
          {children}
        </div>
      </main>

      {/* Floating Toast Message */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <CheckCircle size={20} weight="fill" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
