// // import React, { useState, useEffect } from 'react'; 
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { 
// //   SquaresFour, ListChecks, 
// //   User, SignOut, Sun, Moon, Bell, List, CheckCircle, Note as NoteIcon, BellSlash, WarningCircle 
// // } from '@phosphor-icons/react';
// // import { useAuth } from '../context/AuthContext'; 
// // import TaskoraLogo from '../components/TaskoraLogo'; 
// // import API from '../services/api'; 
// // import './Dashboard.css'; 

// // export default function Layout({ children, darkMode, toggleTheme }) {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { user, logout } = useAuth(); 

// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [toast, setToast] = useState({ show: false, message: '', type: '' });

// //   // Notification States
// //   const [showNotifications, setShowNotifications] = useState(false);
// //   const [notifications, setNotifications] = useState([]);

// //   // Fetch Real Notifications Logic
// //   // --- 2. FETCH REAL NOTIFICATIONS LOGIC ---
// //   useEffect(() => {
// //     const fetchNotifications = async () => {
// //       if(!user) return;

// //       try {
// //         const [tasksRes, notesRes] = await Promise.all([
// //           API.get("/tasks"), 
// //           API.get("/notes")
// //         ]);

// //         const tasks = tasksRes.data;
// //         const notes = notesRes.data;
// //         const today = new Date();
// //         today.setHours(0, 0, 0, 0); 

// //         // LOGIC 1: Find Overdue Tasks
// //         const overdueTasks = tasks
// //           .filter(task => {
// //             const dueDate = new Date(task.dueDate);
// //             return task.dueDate && dueDate < today && task.status !== 'completed';
// //           })
// //           .map(task => ({
// //             id: task._id,
// //             text: `Overdue: ${task.title}`,
// //             time: new Date(task.dueDate).toLocaleDateString(), // Already showing Date
// //             type: 'danger', 
// //             link: '/my-tasks'
// //           }));

// //         // LOGIC 2: Find Recently Created Notes (Last 24 hours)
// //         const recentNotes = notes
// //           .filter(note => {
// //             const createdAt = new Date(note.createdAt);
// //             const diffTime = Math.abs(today - createdAt);
// //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
// //             return diffDays <= 1; // Created within 1 day
// //           })
// //           .map(note => ({
// //             id: note._id,
// //             text: `New Note: ${note.title || 'Untitled'}`,
// //             // --- CHANGE: 'Just now' ko hata kar Time dikha rahe hain ---
// //             time: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //             // Example Result: "10:30 AM" ya "2:45 PM"
            
// //             type: 'info', 
// //             link: '/mynotes'
// //           }));

// //         // Combine all notifications
// //         setNotifications([...overdueTasks, ...recentNotes]);

// //       } catch (error) {
// //         console.error("Error fetching notifications:", error);
// //       }
// //     };

// //     fetchNotifications();
// //   }, [user]); 

// //   const toggleSidebar = () => {
// //     setIsSidebarOpen(!isSidebarOpen);
// //   };

// //   const toggleNotifications = () => {
// //     setShowNotifications(!showNotifications);
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     setIsSidebarOpen(false); 
// //     setToast({ show: true, message: 'Logout successfully', type: 'success' });
// //     setTimeout(() => {
// //       navigate('/');
// //       setToast({ show: false, message: '', type: '' });
// //     }, 1500);
// //   };

// //   return (
// //     <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
// //       <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

// //       <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
// //         <div className="logo">
// //           <TaskoraLogo size={32} className="mr-2" />
// //           <span>Taskora</span>
// //         </div>
        
// //         <nav className="nav-menu">
// //           <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
// //             <SquaresFour size={22} /> Dashboard
// //           </Link>

// //           <Link to="/my-tasks" className={`nav-link ${location.pathname === '/my-tasks' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
// //             <ListChecks size={22} /> My Tasks
// //           </Link>

// //           <Link to="/mynotes" className={`nav-link ${location.pathname === '/mynotes' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
// //             <NoteIcon size={22} /> MyNotes
// //           </Link>

// //           <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
// //             <User size={22} /> Profile
// //           </Link>
// //         </nav>

// //         <div className="user-profile">
// //           <div className="avatar-container">
// //             {user?.img ? (
// //               <img src={user.img} alt="User" className="avatar" />
// //             ) : (
// //               <div className="avatar-placeholder">
// //                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// //               </div>
// //             )}
// //           </div>

// //           <div className="user-info">
// //             <h4>{user?.name || 'User'}</h4>
// //             <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{user?.email || ''}</p>
// //           </div>
          
// //           <SignOut size={20} onClick={handleLogout} className="logout-icon" />
// //         </div>
// //       </aside>

// //       <main className="main-content">
// //         <header className="top-header">
// //           <div className="header-left">
// //             <button className="hamburger-btn" onClick={toggleSidebar}>
// //               <List size={28} weight="bold" />
// //             </button>

// //             <h2>
// //               {location.pathname === '/dashboard' ? 'Dashboard Overview' : 
// //                location.pathname === '/my-tasks' ? 'My Tasks' : 
// //                location.pathname === '/mynotes' ? 'My Notes' : 
// //                'Profile Settings'}
// //             </h2>
// //             <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
// //           </div>
          
// //           <div className="header-right">
// //             <button className="icon-btn" onClick={toggleTheme}>
// //               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
// //             </button>

// //             {/* Notification UI */}
// //             <div className="relative">
// //               <button 
// //                 className="icon-btn" 
// //                 onClick={toggleNotifications}
// //               >
// //                 <Bell size={20} weight={showNotifications ? "fill" : "regular"} />
// //                 {notifications.length > 0 && (
// //                   <span className="notif-badge"></span>
// //                 )}
// //               </button>

// //               {showNotifications && (
// //                 <div className="notification-dropdown">
// //                   <div className="notif-header">
// //                     <h4>Reminders</h4>
// //                     <span className="mark-read" onClick={() => setNotifications([])}>Clear All</span>
// //                   </div>
// //                   <div className="notif-list">
// //                     {notifications.length === 0 ? (
// //                       <div className="notif-empty">
// //                         <BellSlash size={32} weight="thin" />
// //                         <p>No new notifications</p>
// //                       </div>
// //                     ) : (
// //                       notifications.map((notif) => (
// //                         <Link 
// //                           key={notif.id} 
// //                           to={notif.link} 
// //                           className="notif-item"
// //                           onClick={() => setShowNotifications(false)}
// //                         >
// //                           <div className={`notif-icon-wrap ${notif.type}`}>
// //                             {notif.type === 'danger' ? <WarningCircle size={20} weight="fill" /> : <Bell size={20} weight="fill" />}
// //                           </div>
// //                           <div className="notif-content">
// //                             <p>{notif.text}</p>
// //                             <span className="notif-time">{notif.time}</span>
// //                           </div>
// //                         </Link>
// //                       ))
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //           </div>
// //         </header>

// //         <div className="content-scroll">
// //           {children}
// //         </div>
// //       </main>

// //       {toast.show && (
// //         <div className={`toast-notification toast-${toast.type}`}>
// //           <CheckCircle size={20} weight="fill" />
// //           <span>{toast.message}</span>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from 'react'; 
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   SquaresFour, ListChecks, 
//   User, SignOut, Sun, Moon, Bell, List, CheckCircle, Note as NoteIcon, BellSlash, WarningCircle 
// } from '@phosphor-icons/react';
// import { useAuth } from '../context/AuthContext'; 
// import TaskoraLogo from '../components/TaskoraLogo'; 
// import API from '../services/api'; 
// import './Dashboard.css'; 

// export default function Layout({ children, darkMode, toggleTheme }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth(); 

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: '' });

//   // --- Notification States ---
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
  
//   // FIX: LocalStorage se time load karein taaki refresh pe bhi pata rahe
//   const [lastClearedAt, setLastClearedAt] = useState(() => {
//     const saved = localStorage.getItem('taskora_notif_cleared');
//     return saved ? new Date(saved) : null;
//   });

//   // --- FETCH REAL NOTIFICATIONS LOGIC ---
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if(!user) return;

//       try {
//         const [tasksRes, notesRes] = await Promise.all([
//           API.get("/tasks"), 
//           API.get("/notes")
//         ]);

//         const tasks = tasksRes.data;
//         const notes = notesRes.data;
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 

//         // LOGIC 1: Find Overdue Tasks
//         const overdueTasks = tasks
//           .filter(task => {
//             const dueDate = new Date(task.dueDate);
//             return task.dueDate && dueDate < today && task.status !== 'completed';
//           })
//           .map(task => ({
//             id: task._id,
//             text: `Overdue: ${task.title}`,
//             time: new Date(task.dueDate).toLocaleDateString(),
//             type: 'danger', 
//             link: '/my-tasks'
//           }));

//         // LOGIC 2: Find Recent Notes
//         const recentNotes = notes
//           .filter(note => {
//             const createdAt = new Date(note.createdAt);
            
//             // 1. 24 Hours Rule
//             const diffTime = Math.abs(today - createdAt);
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//             if (diffDays > 1) return false;

//             // 2. Clear Rule (Check LocalStorage Time)
//             // Agar note "Clear All" ke baad bana hai toh dikhega, pehle wale nahi.
//             if (lastClearedAt) {
//               const clearTime = new Date(lastClearedAt);
//               if (createdAt <= clearTime) {
//                 return false; // Old notification, hide it
//               }
//             }

//             return true;
//           })
//           .map(note => ({
//             id: note._id,
//             text: `New Note: ${note.title || 'Untitled'}`,
//             time: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             type: 'info', 
//             link: '/mynotes'
//           }));

//         setNotifications([...overdueTasks, ...recentNotes]);

//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, [user, lastClearedAt]); 

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   // --- FIX: Clear Notification Handler (Save to LocalStorage) ---
//   const handleClearNotifications = () => {
//     const now = new Date();
//     setNotifications([]); // UI se hatao
//     setLastClearedAt(now); // State update karo
//     localStorage.setItem('taskora_notif_cleared', now.toISOString()); // <--- BROWSER MEMORY MEIN SAVE KARO
//     setShowNotifications(false);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsSidebarOpen(false); 
//     setToast({ show: true, message: 'Logout successfully', type: 'success' });
//     setTimeout(() => {
//       navigate('/');
//       setToast({ show: false, message: '', type: '' });
//     }, 1500);
//   };

//   return (
//     <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
//       <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

//       <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//         <div className="logo">
//           <TaskoraLogo size={32} className="mr-2" />
//           <span>Taskora</span>
//         </div>
        
//         <nav className="nav-menu">
//           <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
//             <SquaresFour size={22} /> Dashboard
//           </Link>

//           <Link to="/my-tasks" className={`nav-link ${location.pathname === '/my-tasks' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
//             <ListChecks size={22} /> My Tasks
//           </Link>

//           <Link to="/mynotes" className={`nav-link ${location.pathname === '/mynotes' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
//             <NoteIcon size={22} /> MyNotes
//           </Link>

//           <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
//             <User size={22} /> Profile
//           </Link>
//         </nav>

//         <div className="user-profile">
//           <div className="avatar-container">
//             {user?.img ? (
//               <img src={user.img} alt="User" className="avatar" />
//             ) : (
//               <div className="avatar-placeholder">
//                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
//               </div>
//             )}
//           </div>

//           <div className="user-info">
//             <h4>{user?.name || 'User'}</h4>
//             <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{user?.email || ''}</p>
//           </div>
          
//           <SignOut size={20} onClick={handleLogout} className="logout-icon" />
//         </div>
//       </aside>

//       <main className="main-content">
//         <header className="top-header">
//           <div className="header-left">
//             <button className="hamburger-btn" onClick={toggleSidebar}>
//               <List size={28} weight="bold" />
//             </button>

//             <h2>
//               {location.pathname === '/dashboard' ? 'Dashboard Overview' : 
//                location.pathname === '/my-tasks' ? 'My Tasks' : 
//                location.pathname === '/mynotes' ? 'My Notes' : 
//                'Profile Settings'}
//             </h2>
//             <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
//           </div>
          
//           <div className="header-right">
//             <button className="icon-btn" onClick={toggleTheme}>
//               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>

//             <div className="relative">
//               <button 
//                 className="icon-btn" 
//                 onClick={toggleNotifications}
//               >
//                 <Bell size={20} weight={showNotifications ? "fill" : "regular"} />
//                 {notifications.length > 0 && (
//                   <span className="notif-badge"></span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="notification-dropdown">
//                   <div className="notif-header">
//                     <h4>Reminders</h4>
//                     <span className="mark-read" onClick={handleClearNotifications}>Clear All</span>
//                   </div>
//                   <div className="notif-list">
//                     {notifications.length === 0 ? (
//                       <div className="notif-empty">
//                         <BellSlash size={32} weight="thin" />
//                         <p>No new notifications</p>
//                       </div>
//                     ) : (
//                       notifications.map((notif) => (
//                         <Link 
//                           key={notif.id} 
//                           to={notif.link} 
//                           className="notif-item"
//                           onClick={() => setShowNotifications(false)}
//                         >
//                           <div className={`notif-icon-wrap ${notif.type}`}>
//                             {notif.type === 'danger' ? <WarningCircle size={20} weight="fill" /> : <Bell size={20} weight="fill" />}
//                           </div>
//                           <div className="notif-content">
//                             <p>{notif.text}</p>
//                             <span className="notif-time">{notif.time}</span>
//                           </div>
//                         </Link>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </header>

//         <div className="content-scroll">
//           {children}
//         </div>
//       </main>

//       {toast.show && (
//         <div className={`toast-notification toast-${toast.type}`}>
//           <CheckCircle size={20} weight="fill" />
//           <span>{toast.message}</span>
//         </div>
//       )}

//     </div>
//   );
// }

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
  
  // FIX: LocalStorage se time load karein taaki refresh pe bhi pata rahe
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
            text: `Overdue: ${task.title}`,
            time: new Date(task.dueDate).toLocaleDateString(),
            type: 'danger', 
            link: '/my-tasks'
          }));

        // LOGIC 2: Find Recent Notes
        const recentNotes = notes
          .filter(note => {
            const createdAt = new Date(note.createdAt);
            
            // 1. 24 Hours Rule
            const diffTime = Math.abs(today - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays > 1) return false;

            // 2. Clear Rule (Check LocalStorage Time)
            if (lastClearedAt) {
              const clearTime = new Date(lastClearedAt);
              if (createdAt <= clearTime) {
                return false; 
              }
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

  // --- FIX: Clear Notification Handler (Save to LocalStorage) ---
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
    setToast({ show: true, message: 'Logout successfully', type: 'success' });
    setTimeout(() => {
      navigate('/');
      setToast({ show: false, message: '', type: '' });
    }, 1500);
  };

  // Helper function for Initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <TaskoraLogo size={32} className="mr-2" />
          <span>Taskora</span>
        </div>
        
        <nav className="nav-menu">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <SquaresFour size={22} /> Dashboard
          </Link>

          <Link to="/my-tasks" className={`nav-link ${location.pathname === '/my-tasks' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <ListChecks size={22} /> My Tasks
          </Link>

          <Link to="/mynotes" className={`nav-link ${location.pathname === '/mynotes' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <NoteIcon size={22} /> MyNotes
          </Link>

          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <User size={22} /> Profile
          </Link>
        </nav>

        {/* --- UPDATED MODERN PROFILE SECTION --- */}
        <div style={{
          padding: '15px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--card-bg, transparent)'
        }}>
          {/* Avatar / Initials */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.img ? (
              <img 
                src={user.img} 
                alt="User" 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '2px solid var(--primary, #6366f1)' 
                }} 
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary, #6366f1)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: '2px solid transparent'
              }}>
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h4 style={{
              margin: 0, 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              color: 'var(--text-main, #111827)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'User'}
            </h4>
            <p style={{
              margin: 0, 
              fontSize: '0.8rem', 
              color: 'var(--text-secondary, #6b7280)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email || ''}
            </p>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary, #6b7280)',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            title="Logout"
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg, #f3f4f6)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <SignOut size={20} weight="bold" />
          </button>
        </div>
        {/* --- END UPDATED SECTION --- */}

      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <List size={28} weight="bold" />
            </button>

            <h2>
              {location.pathname === '/dashboard' ? 'Dashboard Overview' : 
               location.pathname === '/my-tasks' ? 'My Tasks' : 
               location.pathname === '/mynotes' ? 'My Notes' : 
               'Profile Settings'}
            </h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="header-right">
            <button className="icon-btn" onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button 
                className="icon-btn" 
                onClick={toggleNotifications}
              >
                <Bell size={20} weight={showNotifications ? "fill" : "regular"} />
                {notifications.length > 0 && (
                  <span className="notif-badge"></span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notif-header">
                    <h4>Reminders</h4>
                    <span className="mark-read" onClick={handleClearNotifications}>Clear All</span>
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <BellSlash size={32} weight="thin" />
                        <p>No new notifications</p>
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

      {/* --- UPDATED TOAST SECTION (Fixed Top-Right) --- */}
      {/* {toast.show && (
        <div 
          className={`toast-notification toast-${toast.type}`}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999
            // Baaki styling CSS file se aayegi
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <WarningCircle size={20} weight="fill" />}
          <span>{toast.message}</span>
        </div>
      )} */}
 {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <CheckCircle size={20} weight="fill" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
