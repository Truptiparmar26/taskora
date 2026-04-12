import React from 'react';
import { 
  PhSquaresFour, PhListChecks, PhCalendar, PhGear, PhSignOut, 
  PhCheckSquareOffset 
} from 'react-icons/ph';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo">
        <PhCheckSquareOffset size={28} />
        <span>TaskMaster</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        <div className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
             onClick={() => setActiveTab('dashboard')}>
          <PhSquaresFour size={22} /> Dashboard
        </div>
        <div className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`} 
             onClick={() => setActiveTab('tasks')}>
          <PhListChecks size={22} /> My Tasks
        </div>
        <div className="nav-link">
          <PhCalendar size={22} /> Calendar
        </div>
        <div className="nav-link">
          <PhGear size={22} /> Settings
        </div>
      </nav>

      <div className="user-profile">
        <img src="https://picsum.photos/seed/user123/100/100" alt="User" className="avatar" />
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</p>
        </div>
        <PhSignOut size={20} style={{ marginLeft: 'auto', cursor: 'pointer', color: 'var(--text-secondary)' }} />
      </div>
    </aside>
  );
};

export default Sidebar;