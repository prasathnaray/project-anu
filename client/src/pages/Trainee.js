import React from 'react'
import TraineeList from '../components/admin/traineeList'
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Navigate } from 'react-router-dom';
function Trainee() {
  const token = localStorage.getItem('user_token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = jwtDecode(token);

  if (![99, 101, 102].includes(Number(decoded.role))) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      {/* {token.role == 102 && <TraineeList />} */}
          <TraineeList />
    </>
  )
}

export default Trainee