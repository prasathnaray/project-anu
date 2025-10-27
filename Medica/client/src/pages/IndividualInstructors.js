import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function IndividualInstructors() {
    let {people_id} = useParams();
    let token = localStorage.getItem('user_token');
    if (!token) {
                    return <Navigate to="/" replace />;
    }
    const decoded = jwtDecode(token);
    if (decoded.role != 101 && decoded.role != 102) {
                    return <Navigate to="/" replace />;
    }
  return (
    <div className={`flex flex-col min-h-screen`}>
        {people_id}
    </div>
  )
}

export default IndividualInstructors