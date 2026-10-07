import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import APP_URL from '../API/config';
import api from '../API/api';
import { getSocket } from '../utils/socket';
import clearLocalSession from '../Auth/clearLocalSession';

const SessionLoading = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#f7faf5] px-6 text-slate-800">
    <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-[#e1ead8] bg-white px-8 py-10 text-center shadow-[0_20px_60px_-35px_rgba(72,104,30,0.45)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef7df] text-[#6fae2b]">
        <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#d8eac0] border-t-[#8dc63f]" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-800">Preparing your learning space</p>
      <p className="mt-2 text-xs text-slate-500">Just a moment while we get everything ready.</p>
    </div>
  </main>
);

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

  if (renewing) return <SessionLoading />;
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.sid || decoded.exp * 1000 <= Date.now()) {
      return <SessionLoading />;
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
