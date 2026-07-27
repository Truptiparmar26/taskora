import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTasks from './pages/MyTasks'; 
import MyNotes from './pages/MyNotes';
import Profile from './pages/Profile';
import PrivateRoute from "./components/PrivateRoute";
import "./App.css"; 
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Command Deck Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard darkMode={darkMode} toggleTheme={toggleTheme} />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <PrivateRoute>
                <MyTasks darkMode={darkMode} toggleTheme={toggleTheme} />
              </PrivateRoute>
            }
          />
          <Route
            path="/mynotes"
            element={
              <PrivateRoute>
                <MyNotes darkMode={darkMode} toggleTheme={toggleTheme} />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile darkMode={darkMode} toggleTheme={toggleTheme} />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;