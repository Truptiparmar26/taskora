// // // import { createContext, useState } from "react";
// // import React, { createContext, useState, useContext } from 'react';

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [token, setToken] = useState(localStorage.getItem("token"));
// // const [user, setUser] = useState({ name: 'John Doe', role: 'Frontend Developer' });
// //   const [darkMode, setDarkMode] = useState(false);

// //   const login = (token) => {
// //     localStorage.setItem("token", token);
// //     setToken(token);
// //   };

// //    const toggleTheme = () => {
// //     setDarkMode(!darkMode);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setToken(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ token, login,user, darkMode, toggleTheme, setUser, logout }}>
// //       {/* {children} */}
// //         <div className={darkMode ? 'dark-mode' : ''}>
// //         {children}
// //       </div>
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { jwtDecode } from "jwt-decode"; // Import this library

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState(null); // Start as null
//   const [darkMode, setDarkMode] = useState(false);

//   // Function to decode token and set user
//   const setUserFromToken = (token) => {
//     if (token) {
//       const decoded = jwtDecode(token); // Gets { id: '...', iat: ..., exp: ... }
//       // Since your backend currently only sends ID in token, we mock the name or update backend
//       // Ideally, your backend login should return user object too.
//       // For now, we use the ID.
//       setUser({ 
//         id: decoded.id, 
//         name: "Current User", // Update this if backend sends user data in login response
//         role: "User" 
//       });
//     } else {
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     setUserFromToken(token);
//   }, [token]);

//   const login = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, user, darkMode, toggleTheme, setUser, logout }}>
//       <div className={darkMode ? 'dark-mode' : ''}>
//         {children}
//       </div>
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 1. SYNC INITIALIZATION: Page load hote hi User data utha lega
  // Yeh 'useEffect' se pehle chalta hai, isliye "Guest User" nahi dikhega.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  // --- HELPER: LOGIN SUCCESS ---
  const handleAuthSuccess = (response) => {
    const { token, user } = response;
    
    // Token save karein
    localStorage.setItem("token", token);
    setToken(token);

    // User data save karein (State + LocalStorage)
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // --- LOGIN FUNCTION ---
  const login = (authResponse) => {
    handleAuthSuccess(authResponse);
  };

  // --- UPDATE USER FUNCTION ---
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
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider value={{ token, login, user, updateUser, darkMode, toggleTheme, logout, setUser }}>
      <div className={darkMode ? 'dark-mode' : ''}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);