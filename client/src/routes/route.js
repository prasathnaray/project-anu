import React, { lazy, Suspense }  from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SideBar from '../components/sideBar';

import GoogleAnalytics from '../components/GoogleAnalytics';

import Login from '../Auth/login';
import AccountVerification from '../Auth/AccountVerification';
import PrivateRoute from './ProtectedRoutes';
const Dashboard = lazy(() => import('../pages/dashboard'));
// import Profile from '../pages/Profile';
const Trainee = lazy(() => import('../pages/Trainee'));
const AddTrainee = lazy(() => import('../components/admin/addTrainee'));
const Queries = lazy(() => import('../pages/Queries'));
const Instructors = lazy(() => import('../pages/Instructors'));
const Batch = lazy(() => import('../pages/Batch'));
const Course = lazy(() => import('../pages/Course'));
const AddCourse = lazy(() => import('../components/admin/AddCourse'));
const Curiculum = lazy(() => import('../pages/Curiculum'));
const BatchIndividual = lazy(() => import('../pages/BatchIndividual'));
const Requests = lazy(() => import('../pages/Requests'));
const Stream = lazy(() => import('../pages/Stream'));
const Chapters = lazy(() => import('../pages/Chapters'));
const Module = lazy(() => import('../pages/Module'));
const Resource = lazy(() => import('../pages/Resource'));
const Schedules = lazy(() => import('../pages/Schedules'));
const TraineeIndividual = lazy(() => import('../pages/TraineeIndividual'));
const IndividualInstructors = lazy(() => import('../pages/IndividualInstructors'));
const VolumeList = lazy(() => import('../pages/VolumeList'));
const RequestRaised = lazy(() => import('../pages/RequestRaised'));
const VideoMedica = lazy(() => import('../pages/VideoMedica'));
const InsideCertifications = lazy(() => import('../pages/InsideCertifications'));
const Reports = lazy(() => import('../pages/Reports'));
const Academics = lazy(() => import('../pages/Academics'));
const MyLearning = lazy(() => import('../pages/MyLearning'));
const MyProgress = lazy(() => import('../pages/MyProgress'));
const TraineeDashboard = lazy(() => import('../components/trainee/TraineeDashboard'));
const CourseMapping = lazy(() => import('../pages/CourseMapping'));
const CustomCourse = lazy(() => import('../pages/CustomCourse'));
const ReattData = lazy(() => import('../pages/ReattData'));
const ContentAccess = lazy(() => import('../pages/ContentAccess'));
const Sessions = lazy(() => import('../pages/Sessions'));
const Cluster = lazy(() => import('../pages/Cluster'));
function RoutesPath() {
  return (
    <BrowserRouter>
            <GoogleAnalytics />
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading page...</div>}>
            <Routes>
                    <Route path="/" element={<Login />}/>
                    <Route path="/verify-account" element={<AccountVerification />} />
                    <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            {/* <Route path="/profile" element={<Profile />} /> */}
                            <Route path="/trainees" element={<Trainee /> } />
                            <Route path="/:people/add" element={<AddTrainee /> } />
                            <Route path="/queries" element={<Queries />} />
                            <Route path="/instructors" element={<Instructors />} />
                            <Route path="/:people/add" element={<Instructors />} />
                            <Route path="/batch" element={<Batch />} />
                            <Route path="/certificate" element={<Course />}/>
                            <Route path="/course/add" element={<AddCourse />} />
                            <Route path="/curriculum" element={<Curiculum />} />
                            <Route path="/batch/:batch_id" element={<BatchIndividual />} />
                            <Route path="/all-requests" element={<Requests />} />
                            <Route element={<PrivateRoute allowedRoles={[101, 103]} />}>
                              <Route path="/vrspace" element={<Stream />} />
                            </Route>
                            <Route path="/chapters/:course_id" element={<Chapters />} />
                            <Route path="/module/:chapter_id/:course_id" element={<Module />} />
                            <Route path="/resource/:module_id" element={<Resource />} />
                            <Route path="/schedules" element={<Schedules />} />
                            <Route path="/trainee/:people_id" element={<TraineeDashboard />} />
                            <Route path="/instructor/:people_id" element={<IndividualInstructors />} />
                            <Route path="/volume-management" element={<VolumeList />} />
                            <Route path="/cluster" element={<Cluster />} />
                            <Route path="/request-raised" element={<RequestRaised />} />
                            <Route path="/demo-video" element={<VideoMedica />} />
                            <Route path="/cert-course/:certificate_id" element={<InsideCertifications />} />
                            <Route path="/cert_course/:certificate_id" element={<InsideCertifications />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/academics" element={<Academics />} />
                            <Route path="/course-mapping" element={<CourseMapping />} />
                            <Route path="/custom-course" element={<CustomCourse />} />
                            <Route path="/reatt-data" element={<ReattData />} />
                            <Route path="/my-learning" element={<MyLearning />} />
                            <Route path="/my-Learning" element={<MyLearning />} />
                            <Route path="/my-progress" element={<MyProgress />} />
                            <Route path="/sessions" element={<Sessions />} />
                            <Route element={<PrivateRoute allowedRoles={[99, 101, 102, 103]} />}>
                              <Route path="/course-access" element={<ContentAccess />} />
                            </Route>
                     </Route>
                    <Route path="*" element={<Login />}/>
            </Routes>
            </Suspense>
    </BrowserRouter>
  )
}

export default RoutesPath;
