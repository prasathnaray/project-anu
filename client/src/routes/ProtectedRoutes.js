import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = () => {
  const token = localStorage.getItem('user_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  try {
    const decoded = jwtDecode(token);
    // Optional: Check for token expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('user_token');
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
