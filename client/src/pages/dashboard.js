import React from 'react'
import TraineeDashboard from '../components/trainee/TraineeDashboard.js';
import AdminDashboard from '../components/admin/AdminDashboard.js';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
function Dashboard() {
  const token = localStorage.getItem('user_token')
  const decoded = jwtDecode(token);
  if (!decoded.role) {
    return <Navigate to="/" replace />;
  }
  return (
        <>
          {decoded.role == 103 && <TraineeDashboard />}
          {decoded.role == 101 && <AdminDashboard />}
          {decoded.role == 102 && <TraineeDashboard /> }
        </>
  )
}

export default Dashboard;