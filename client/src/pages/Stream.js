import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import AdminStreamPanel from '../components/streaming/AdminStreamPanel';
import TraineeStreamPanel from '../components/streaming/TraineeStreamPanel';

function Stream() {
  const [buttonOpen, setButtonOpen] = useState(true);
  const storedToken = localStorage.getItem('user_token');
  let role;
  try {
    role = Number(jwtDecode(storedToken).role);
  } catch (_) {
    return <Navigate to="/" replace />;
  }

  if (![101, 103].includes(role)) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-grow">
        <SideBar handleButtonOpen={() => setButtonOpen((open) => !open)} buttonOpen={buttonOpen} />
        <main className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-gray-100 min-h-[calc(100vh-3rem)] transition-all`}>
          <div className="px-5 md:px-10 xl:px-16 py-6 w-full max-w-[1800px] mx-auto">
            <div className="text-sm text-gray-500">Streams / Live</div>
            <h1 className="mt-3 mb-5 font-semibold text-2xl text-gray-700">
              {role === 101 ? 'Scan center streams' : 'Trainee streaming'}
            </h1>
            {role === 101 ? <AdminStreamPanel /> : <TraineeStreamPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Stream;
