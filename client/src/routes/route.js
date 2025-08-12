import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SideBar from '../components/sideBar';
import Login from '../Auth/login';
import PrivateRoute from './ProtectedRoutes';
import Dashboard from '../pages/dashboard';
import Profile from '../pages/Profile';
import Trainee from '../pages/Trainee';
import AddTrainee from '../components/admin/addTrainee';
import Queries from '../pages/Queries';
import Instructors from '../pages/Instructors';
import Batch from '../pages/Batch';
import Course from '../pages/Course';
import AddCourse from '../components/admin/AddCourse';
import Curiculum from '../pages/Curiculum';
import BatchIndividual from '../pages/BatchIndividual';
function RoutesPath() {
  return (
    <BrowserRouter>
            <Routes>
                    <Route path="/" element={<Login />}/>
                    <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/trainees" element={<Trainee /> } />
                            <Route path="/:people/add" element={<AddTrainee /> } />
                            <Route path="/queries" element={<Queries />} />
                            <Route path="/instructors" element={<Instructors />} />
                            <Route path="/:people/add" element={<Instructors />} />
                            <Route path="/batch" element={<Batch />} />
                            <Route path="/course" element={<Course />}/>
                            <Route path="/course/add" element={<AddCourse />} />
                            <Route path="/curriculum" element={<Curiculum />} />
                            <Route path="/batch/:batch_id" element={<BatchIndividual />} />
                     </Route>
                    <Route path="*" element={<Login />}/>
            </Routes>
    </BrowserRouter>
  )
}

export default RoutesPath;