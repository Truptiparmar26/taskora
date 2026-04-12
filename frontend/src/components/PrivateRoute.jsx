// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const { token } = useContext(AuthContext);

//   return token ? children : <Navigate to="/" />;
// };

// export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you use AuthContext, or use localStorage

// If you don't have AuthContext yet, use this simple version:
const PrivateRoute = ({ children }) => {
  // Check if user is logged in (checking localStorage for token)
  const user = localStorage.getItem("token"); 

  if (!user) {
    // If not logged in, redirect to Login page
    return <Navigate to="/" />;
  }

  // If logged in, render the child component (Dashboard)
  return children;
};

export default PrivateRoute;