import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SideBar from '../components/sideBar';
import Login from '../Auth/login';
import PrivateRoute from './ProtectedRoutes';
import Dashboard from '../pages/dashboard';
function RoutesPath() {
  return (
    <BrowserRouter>
            <Routes>
                    <Route path="/" element={<Login />}/>
                    <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<Login />}/>
            </Routes>
    </BrowserRouter>
  )
}

export default RoutesPath;