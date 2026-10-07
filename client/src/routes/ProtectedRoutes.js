import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APP_URL from '../API/config';
import api from '../API/api';
import { getSocket } from '../utils/socket';
import clearLocalSession from '../Auth/clearLocalSession';

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('user_token'));
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let socket = null;

    try {
      socket = getSocket();
      if (socket) {
        const handleSessionRevoked = (data) => {
          try {
            const currentToken = localStorage.getItem('user_token');
            if (!currentToken) return;
            const decoded = jwtDecode(currentToken);
            const isMatch =
              (data?.sessionId && decoded.sid === data.sessionId) ||
              (data?.all && decoded.user_mail?.toLowerCase() === data.userEmail?.toLowerCase());

            if (isMatch) {
              clearLocalSession();
              setToken(null);
              window.location.href = '/';
            }
          } catch (_) {}
        };

        socket.on('session:revoked', handleSessionRevoked);
      }
    } catch (_) {}

    const checkActiveSession = () => {
      if (cancelled) return;
      const currentToken = localStorage.getItem('user_token');
      if (!currentToken) return;
      api.get('/api/v1/sessions/validate').catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearLocalSession();
          setToken(null);
          window.location.href = '/';
        }
      });
    };

    // Heartbeat check every 10 seconds
    const interval = setInterval(checkActiveSession, 10000);
    window.addEventListener('focus', checkActiveSession);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', checkActiveSession);
      if (socket) {
        socket.off('session:revoked');
      }
    };
  }, []);

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
