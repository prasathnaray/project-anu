import React from 'react'
import TraineeDashboard from '../components/trainee/TraineeDashboard.js';
import AdminDashboard from '../components/admin/AdminDashboard.js';
import SuperAdminDashboard from '../components/superadmin/SuperAdminDashboard.js'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import TutorDashboard from './TutorDashboard.js';
function Dashboard() {
  const token = localStorage.getItem('user_token')
  const decoded = jwtDecode(token);
  if (!decoded.role) {
    return <Navigate to="/" replace />;
  }
  return (
        <>
          {decoded.role == 99 && <SuperAdminDashboard />}
          {decoded.role == 103 && <TraineeDashboard />}
          {decoded.role == 101 && <AdminDashboard />}
          {decoded.role == 102 && <TutorDashboard /> }
        </>
  )
}
export default Dashboard;