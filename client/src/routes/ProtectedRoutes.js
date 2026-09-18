import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APP_URL from '../API/config';
import clearLocalSession from '../Auth/clearLocalSession';

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('user_token'));
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = localStorage.getItem('user_token');
    if (!stored) {
      setToken(null);
      return;
    }
    let decoded;
    try {
      decoded = jwtDecode(stored);
    } catch (_) {
      clearLocalSession();
      setToken(null);
      return;
    }
    if (!decoded.sid) {
      clearLocalSession();
      setToken(null);
      return;
    }
    if (decoded.exp * 1000 > Date.now()) {
      setToken(stored);
      return;
    }

    setRenewing(true);
    axios.post(`${APP_URL}/api/v1/refresh-token`, {}, { withCredentials: true })
      .then((response) => {
        if (cancelled) return;
        localStorage.setItem('user_token', response.data.accessToken);
        setToken(response.data.accessToken);
      })
      .catch(() => {
        if (cancelled) return;
        clearLocalSession();
        setToken(null);
      })
      .finally(() => { if (!cancelled) setRenewing(false); });
    return () => { cancelled = true; };
  }, [location.pathname]);

  if (renewing) return <div className="p-6 text-gray-500">Restoring session…</div>;
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.sid || decoded.exp * 1000 <= Date.now()) {
      return <div className="p-6 text-gray-500">Restoring session…</div>;
    }
    if (allowedRoles && !allowedRoles.map(Number).includes(Number(decoded.role))) {
      return <Navigate to="/dashboard" replace />;
    }
    const routeRoleRules = [
      { prefixes: ['/academics', '/course-mapping', '/reatt-data', '/curriculum'], roles: [99] },
      { prefixes: ['/instructors'], roles: [99, 101] },
      { prefixes: ['/trainees'], roles: [99, 101, 102] },
      { prefixes: ['/volume-management'], roles: [99, 101, 102] },
      { prefixes: ['/custom-course'], roles: [99, 101] },
      { prefixes: ['/vrspace'], roles: [101, 103] },
      { prefixes: ['/my-learning', '/my-progress'], roles: [103] }
    ];
    const matchedRule = routeRoleRules.find((rule) =>
      rule.prefixes.some((prefix) => location.pathname.toLowerCase().startsWith(prefix)));
    if (matchedRule && !matchedRule.roles.includes(Number(decoded.role))) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  } catch (_) {
    clearLocalSession();
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
