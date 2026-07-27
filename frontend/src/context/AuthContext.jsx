import React, { createContext, useState, useContext } from 'react';
import { CheckCircle, WarningCircle, Clock, Trash } from '@phosphor-icons/react';
import '../pages/PageStyles.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  // ============================================================================
  // GLOBAL TOAST ALERT SYSTEM (Covers all CRUD, Login, Register, Success/Fail)
  // ============================================================================
  const [toast, setToast] = useState({ show: false, message: "", title: "", type: "success" });

  const showToast = (message, title = "Notification", type = "success") => {
    setToast({ show: true, message, title, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleAuthSuccess = (response) => {
    const { token, user } = response;
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = (authResponse) => {
    handleAuthSuccess(authResponse);
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    showToast("You have successfully signed out of your workspace.", "Logout Successful ✨", "success");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Determine dynamic border color based on toast type
  const getBorderClass = (type) => {
    if (type === 'error') return '#ef4444';
    if (type === 'info') return '#3b82f6';
    return '#10b981';
  };

  return (
    <AuthContext.Provider value={{ token, login, user, updateUser, darkMode, toggleTheme, logout, setUser, showToast }}>
      <div className={darkMode ? 'dark-mode' : ''}>
        {children}

        {/* --- UNIVERSAL FLOATING LUXURY TOAST NOTIFICATION --- */}
        {toast.show && (
          <div className="luxury-toast" style={{ borderLeft: `5px solid ${getBorderClass(toast.type)}` }}>
            <div className={`toast-badge-icon toast-${toast.type}-badge`}>
              {toast.type === 'success' && <CheckCircle size={24} weight="fill" />}
              {toast.type === 'error' && <WarningCircle size={24} weight="fill" />}
              {toast.type === 'info' && <Clock size={24} weight="fill" />}
            </div>
            <div className="toast-details">
              <h4>{toast.title}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);