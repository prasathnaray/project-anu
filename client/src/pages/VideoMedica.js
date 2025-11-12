import React from 'react';
import Video from '../Images/Demo video.mp4';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function VideoMedica() {
  const token = localStorage.getItem('user_token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = jwtDecode(token);

  if (decoded.role != 101 && decoded.role != 102) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <video 
        className="w-full h-full object-cover" 
        controls 
        autoPlay 
      >
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoMedica;