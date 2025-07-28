import React from 'react'
import { jwtDecode } from 'jwt-decode'
import SideBar from '../components/sideBar';
import { Navigate } from 'react-router-dom';
function Course() {

  ///main Layout
  let token = localStorage.getItem('user_token');
  const decoded = jwtDecode(token);
  if (decoded.role != 103) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={`flex`}>
            <div>
                    <SideBar />
            </div>
            <div className="">

            </div>
    </div>
  )
}

export default Course