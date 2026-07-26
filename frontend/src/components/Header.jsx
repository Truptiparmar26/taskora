import React from 'react';
import { PhMagnifyingGlass, PhMoon, PhSun, PhList, PhBell } from 'react-icons/ph';
import { useAuth } from '../context/AuthContext';

const Header = ({ search, setSearch, toggleSidebarMobile }) => {
  const { darkMode, toggleTheme } = useAuth();
  
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-btn" onClick={toggleSidebarMobile} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }} id="mobile-menu-btn">
          <PhList />
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{date}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="search-bar">
          <PhMagnifyingGlass color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          {darkMode ? <PhSun /> : <PhMoon />}
        </button>
        <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <PhBell />
        </button>
      </div>
    </header>
  );
};

export default Header;