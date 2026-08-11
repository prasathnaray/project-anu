import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
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
    if (allowedRoles && !allowedRoles.map(Number).includes(Number(decoded.role))) {
      return <Navigate to="/dashboard" replace />;
    }
    const routeRoleRules = [
      { prefixes: ['/academics', '/course-mapping', '/reatt-data', '/curriculum'], roles: [99] },
      { prefixes: ['/instructors'], roles: [99, 101] },
      { prefixes: ['/trainees'], roles: [99, 101, 102] },
      { prefixes: ['/volume-management', '/custom-course'], roles: [99, 101, 102] },
      { prefixes: ['/my-learning', '/my-progress'], roles: [103] }
    ];
    const matchedRule = routeRoleRules.find((rule) => rule.prefixes.some((prefix) => location.pathname.toLowerCase().startsWith(prefix)));
    if (matchedRule && !matchedRule.roles.includes(Number(decoded.role))) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};
export default PrivateRoute;
