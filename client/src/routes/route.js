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
import Requests from '../pages/Requests';
import Stream from '../pages/Stream';
// import Publisher from '../components/testComp';
import IvsSubscriber from '../components/testComp';
import IvsPublisher from '../components/ivsPublish';
import Chapters from '../pages/Chapters';
import Module from '../pages/Module';
import Resource from '../pages/Resource';
import Schedules from '../pages/Schedules';
import TraineeIndividual from '../pages/TraineeIndividual';
import IndividualInstructors from '../pages/IndividualInstructors';
import VolumeList from '../pages/VolumeList';
import RequestRaised from '../pages/RequestRaised';
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
                            <Route path="/all-requests" element={<Requests />} />
                            <Route path="/vrspace" element={<Stream />} />
                            <Route path="/video" element={<IvsSubscriber />} />
                            <Route path="/publish" element={<IvsPublisher />} />
                            <Route path="/chapters/:course_id" element={<Chapters />} />
                            <Route path="/module/:chapter_id/:course_id" element={<Module />} />
                            <Route path="/resource/:module_id" element={<Resource />} />
                            <Route path="/schedules" element={<Schedules />} />
                            <Route path="/trainee/:people_id" element={<TraineeIndividual />} />
                            <Route path="/instructor/:people_id" element={<IndividualInstructors />} />
                            <Route path="/volume-management" element={<VolumeList />} />
                            <Route path="/request-raised" element={<RequestRaised />} />
                     </Route>
                    <Route path="*" element={<Login />}/>
            </Routes>
    </BrowserRouter>
  )
}

export default RoutesPath;