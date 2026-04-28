// import React from "react";
// import { Navigate, useNavigate, useParams } from "react-router-dom";
// import NavBar from "../navBar";
// import SideBar from "../sideBar";
// import IMAGE_URL from "../../API/imageUrl";
// import TraineeProfileAPI from "../../API/TraineeProfileAPI";
// import HalfDonut from "../../charts/ResourceCompletion";
// import StreakHeatmap from "../../charts/StreaksChart";
// import { jwtDecode } from "jwt-decode";
// import TraineeCompletionTable from "../admin/TraineeCompletionTable";

// function TraineeDashboard() {
//   const navigate = useNavigate();
//   const { people_id } = useParams();
//   const [buttonOpen, setButtonOpen] = React.useState(true);
//   const [profile, setProfile] = React.useState(false);
//   const handleButtonOpen = () => setButtonOpen(!buttonOpen);

//   // ✅ Proper initial state shape to avoid undefined errors
//   const [individualTraineeProfile, setIndividualTraineeProfile] =
//     React.useState({
//       data: [],
//       instructors: [],
//       currentBatches: [],
//       certificates: [],
//     });

//   // ✅ API call
//   let [loading, setLoading] = React.useState(false);
//   const handleApiCall = async (people_id) => {
//     try {
//       setLoading(true);
//       // const token = localStorage.getItem('user_token');
//       const response = await TraineeProfileAPI(people_id);
//       setIndividualTraineeProfile(response.data);
//     } catch (error) {
//       console.error("Error fetching trainee profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const resolvedId = people_id || localStorage.getItem('people_id');
//   React.useEffect(() => {
//     handleApiCall(resolvedId);
//   }, [resolvedId]);

//   // ✅ Loading guard
//   // if (!individualTraineeProfile?.data?.length) {
//   //   return (
//   //     <div className="flex items-center justify-center h-screen text-gray-500">
//   //       Loading profile...
//   //     </div>
//   //   );
//   // }

//   // ✅ Safe computed values using optional chaining
//   const data = individualTraineeProfile.data;
//   const counts = {
//     img:
//       [
//         ...new Set(data.map((item) => item.user_profile_photo).filter(Boolean)),
//       ][0] || "",
//     name:
//       [...new Set(data.map((item) => item.user_name).filter(Boolean))][0] ||
//       "Unknown",
//     desig:
//       [...new Set(data.map((item) => item.user_role).filter(Boolean))][0] ===
//       "103"
//         ? "Trainee"
//         : "Instructor",
//     total_courses_enrolled: new Set(data.map((item) => item.course_id)),
//     total_chapters_associated: new Set(
//       data.map((chapter) => chapter.chapter_id).filter((id) => id !== null)
//     ),
//     resources_completed: data.filter((item) => item.is_completed === true)
//       .length,
//   };

//   let token = localStorage.getItem("user_token");
//   if (!token) {
//     return <Navigate to="/" replace />;
//   }
//   const decoded = jwtDecode(token);
//   if (decoded.role != 101 && decoded.role != 102 && decoded.role !=103) {
//     return <Navigate to="/" replace />;
//   }
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">
//         {/* Sidebar */}
//         <div>
//           <SideBar
//             handleButtonOpen={handleButtonOpen}
//             buttonOpen={buttonOpen}
//           />
//         </div>

//         {/* Main Content */}
//         <div
//           className={`${
//             buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
//           } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
//         >
//           <div className="bg-gray-100">
//             {/* Header */}
//             <div className="p-2 flex justify-between items-center border-b bg-white">
//               <div>Profile</div>
//               <div className="flex gap-2 text-sm">
//                 <div className="text-[#8DC63F]">
//                   <button onClick={() => navigate("/dashboard")}>Home</button>
//                 </div>
//                 <div>/</div>
//                 <div>User Profile</div>
//               </div>
//             </div>
//             <div className="p-2 flex justify-between items-center border-b bg-white">
//               <button
//                 className={`text-sm cursor-pointer p-1 px-2 rounded ${
//                   profile
//                     ? "bg-[#8DC63F] text-white transition-all"
//                     : "bg-transparent text-black"
//                 }`}
//                 onClick={() => setProfile(!profile)}
//               >
//                 Completed Modules
//               </button>
//             </div>

//             {!profile ? (
//               // 👇 Your full profile section when profile === false
//               <>
//                 {/* Profile Section */}
//                 <div className="grid grid-cols-4 gap-3 mx-7">
//                   {/* Left Card */}
//                   <div className="col-span-1 p-4 bg-white shadow mt-4 border-t-2 border-[#8DC63F]">
//                     <div className="flex justify-center items-center mt-10">
//                       {loading ? (
//                         <div className="w-5 h-5 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
//                       ) : (
//                         <img
//                           src={IMAGE_URL + `${counts.img}`}
//                           alt="Profile"
//                           className="mb-4 hover:opacity-80 border-4 border-[#8DC63F] w-24 h-24 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
//                         />
//                       )}
//                     </div>
//                     <div className="text-center text-lg">
//                       {loading ? (
//                         <div className="text-gray-300">Loading</div>
//                       ) : (
//                         counts.name
//                       )}
//                     </div>
//                     <div className="text-center mt-2 text-gray-500">
//                       {counts.desig}
//                     </div>

//                     <div className="border-t mt-6 pt-1 mb-2">
//                       <div className="flex justify-between items-center pt-2">
//                         <div className="text-gray-600 font-semibold">
//                           Total courses enrolled
//                         </div>
//                         <div>{counts.total_courses_enrolled.size}</div>
//                       </div>
//                     </div>

//                     {/* <div className="border-t mt-6 pt-1 mb-2">
//                       <div className="flex justify-between items-center pt-2">
//                         <div className="text-gray-600 font-semibold">
//                           Total chapter access
//                         </div>
//                         <div>{counts.total_chapters_associated.size}</div>
//                       </div>
//                     </div> */}

//                     <div className="border-t mt-6 pt-2 mb-2">
//                       <div className="flex justify-between items-center pt-2">
//                         <div className="text-gray-600 font-semibold">
//                           Total resources completed
//                         </div>
//                         <div>{counts.resources_completed}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side: Charts */}
//                   <div className="col-span-3 p-4 bg-white shadow mt-4 transition-all duration-500">
//                     <div className="text-gray-600 text-lg mb-3 flex justify-between items-center">
//                       <div>Resources Statistics</div>
//                       <div>Batch association</div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="p-12">
//                         <HalfDonut dataa={individualTraineeProfile?.data} />
//                       </div>
//                       <div className="border shadow mt-4 mx-7">
//                         <table className="w-full text-left border-collapse">
//                           <thead>
//                             <tr className="border-b border-gray-300 bg-gray-100">
//                               <th className="py-2 px-4 text-[#8DC63F]">
//                                 Batch Name
//                               </th>
//                               <th className="py-2 px-4 text-[#8DC63F]">
//                                 Instructor Count
//                               </th>
//                               <th className="py-2 px-4 text-[#8DC63F]">
//                                 Instructors
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {(individualTraineeProfile.instructors || individualTraineeProfile.currentBatches || []).map(
//                               (batch, idx) => (
//                                 <tr
//                                   key={idx}
//                                   className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                                 >
//                                   <td className="py-2 px-4">
//                                     {batch.batch_name}
//                                   </td>
//                                   <td className="py-2 px-4">
//                                     {batch.instructor_count}
//                                   </td>
//                                   <td className="py-2 px-4">
//                                     <ul className="list-disc ml-5">
//                                       {batch.instructors.map((inst, i) => (
//                                         <li key={i}>{inst}</li>
//                                       ))}
//                                     </ul>
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submissions */}
//                 <div className="p-4 bg-white shadow mt-4 mx-7 transition-all duration-500">
//                   <div className="mb-2 text-lg text-gray-600">Submissions</div>
//                   <StreakHeatmap data={individualTraineeProfile.data} />
//                 </div>
//               </>
//             ) : (
//               // <div className="p-6 bg-white shadow mx-7 mt-4 rounded text-gray-700 transition-all duration-500">
//               //   <h2 className="text-lg font-semibold mb-2 text-[#8DC63F]">
//               //     Completed Modules
//               //   </h2>
//               //   <p>Display your completed modules or achievements here...</p>
//               // </div>
//                    <TraineeCompletionTable ApiData={individualTraineeProfile}/>
//             )}

//             {/* Instructors Associated - FIX: Properly render the nested structure */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TraineeDashboard;


// 

// dashboard

import React, { useState, useEffect } from 'react'
import NavBar from '../navBar'
import SideBar from '../sideBar'
import { useNavigate, useParams } from 'react-router-dom';
import OverallCompletion from '../../charts/OverallCompletion';
import { GetQueriesAPI } from '../../API/GetQueriesAPI';
import { Check, Clock, BookOpen, Dumbbell, Eye, ClipboardCheck, MessageSquare, CheckCircle, AlertCircle, BarChart } from 'lucide-react';
import { IdentificationIcon } from 'hugeicons-react';
import TraineeProfileAPI from '../../API/TraineeProfileAPI';
import getInteractionsAttemptStats from '../../API/InteractionAttemptAPI';
import InteractionDonut from '../../charts/InteractionDonut';

function TraineeDashboard() {
  const navigate = useNavigate();
  const { people_id } = useParams();
  const [buttonOpen, setButtonOpen] = useState(true);

  // ── Trainee Profile ──────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [individualTraineeProfile, setIndividualTraineeProfile] = useState({
    data: [],
    instructors: [],
    currentBatches: [],
    certificates: [],
    testQuery: [],
  });

  const handleApiCall = async (id) => {
    try {
      setLoading(true);
      const response = await TraineeProfileAPI(id);
      setIndividualTraineeProfile(response.data);
       const batchId = response.data?.currentBatches?.[0]?.batch_id;
    if (batchId) localStorage.setItem('batch_id', batchId);
    } catch (error) {
      console.error('Error fetching trainee profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resolvedId = people_id || localStorage.getItem('people_id');
    handleApiCall(resolvedId);
  }, []);

  // ── Queries ───────────────────────────────────────────────
  const [queries, setQueries] = useState({
    pending: 0, resolved: 0, total: 0, loading: false, error: null
  });

  const handleFetchQueries = async () => {
    try {
      setQueries(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem('user_token');
      const response = await GetQueriesAPI(token);
      const pendingCount = response.result.filter(q => q.status === 'pending').length;
      const resolvedCount = response.result.filter(q => q.status === 'resolved').length;
      setQueries({ pending: pendingCount, resolved: resolvedCount, total: response.total, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching queries:', error);
      setQueries(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => { handleFetchQueries(); }, []);

  // ── Interaction Stats ─────────────────────────────────────
  const [interactionStats, setInteractionStats] = useState({
    data: [], loading: false, error: null
  });

  const handleFetchInteractionStats = async () => {
    try {
      setInteractionStats(prev => ({ ...prev, loading: true }));
      const response = await getInteractionsAttemptStats();

    // Normalize: handle array, wrapped object, or null
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.result)
        ? response.result
        : [];

      setInteractionStats({ data, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching interaction stats:', error);
      setInteractionStats(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => { handleFetchInteractionStats(); }, []);

  // ── Derived values ────────────────────────────────────────
  const allResources = (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null);

  const totalLR = allResources.filter(r => r.resource_type === 'Learning Resource').length;
  const totalPractice = allResources.filter(r => r.resource_type === 'Practice').length;
  const totalTests = allResources.filter(r => r.resource_type === 'Test').length;
  const totalIR = allResources.filter(r => r.resource_type === 'Image Interpretation').length;

  const completedLR = allResources.filter(r => r.resource_type === 'Learning Resource' && r.is_completed === true).length;
  const completedPractice = allResources.filter(r => r.resource_type === 'Practice' && r.is_completed === true).length;
  const completedTests = allResources.filter(r => r.resource_type === 'Test' && r.is_completed === true).length;
  const completedIR = allResources.filter(r => r.resource_type === 'Image Interpretation' && r.is_completed === true).length;

  const totalResources = allResources.length;
  const completed = allResources.filter(r => r.is_completed === true).length;
  const attempted = (individualTraineeProfile?.testQuery ?? []).length;
  const totalAttempts = interactionStats.data.reduce((sum, r) => sum + Number(r.attempt_count), 0);

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
    });
  };

  // ── Spinner ───────────────────────────────────────────────
  const Spinner = ({ color = '#8DC63F', size = 5 }) => (
    <div
      className={`w-${size} h-${size} border-2 border-t-transparent rounded-full animate-spin`}
      style={{ borderColor: `${color} transparent transparent transparent` }}
    />
  );

  // ── Stat Card ─────────────────────────────────────────────
  const StatCard = ({ icon: Icon, iconColor, label, completed, total }) => {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
      <div className="border shadow-sm rounded-lg p-3 bg-white flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className={`p-2 rounded-lg bg-gray-50`}>
            <Icon size={20} className={iconColor} />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">{label}</div>
            {loading ? (
              <div className="flex justify-end mt-1"><Spinner /></div>
            ) : (
              <div className="text-xl font-bold text-gray-700">
                {completed}
                <span className="text-sm font-normal text-gray-400">/{total}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: '#8DC63F' }}
          />
        </div>
        <div className="text-[10px] text-gray-400">{pct}% completed</div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        <div>
          <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />
        </div>

        <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-5">

              {/* ── Left Panel ───────────────────────────────── */}
              <div className="col-span-2 flex flex-col gap-4">

                {/* Welcome Card */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  {/* <div className="text-gray-400 text-sm">Welcome back</div> */}
                  <div className="text-xl pt-1 font-semibold text-gray-700">
                    Welcome Back, {individualTraineeProfile.data[0]?.user_name || 'NA'}
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <StatCard
                    icon={BookOpen}
                    iconColor="text-blue-500"
                    label="Learning Resources"
                    completed={completedLR}
                    total={totalLR}
                  />
                  <StatCard
                    icon={Dumbbell}
                    iconColor="text-green-500"
                    label="Practices"
                    completed={completedPractice}
                    total={totalPractice}
                  />
                  <StatCard
                    icon={ClipboardCheck}
                    iconColor="text-orange-500"
                    label="Tests"
                    completed={completedTests}
                    total={totalTests}
                  />
                  <StatCard
                    icon={Eye}
                    iconColor="text-purple-500"
                    label="Image Interpretations"
                    completed={completedIR}
                    total={totalIR}
                  />
                </div>

                {/* Queries Card */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">Queries Raised</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold text-[#8DC63F]">
                        {queries.loading ? <Spinner color="#8DC63F" /> : queries.total}
                      </div>
                    </div>
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-orange-400" />
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-500">
                        {queries.loading ? <Spinner color="#f97316" /> : queries.pending}
                      </div>
                    </div>
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-green-500" />
                        <div className="text-sm text-gray-500">Resolved</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {queries.loading ? <Spinner color="#16a34a" /> : queries.resolved}
                      </div>
                    </div>
                  </div>
                  {queries.error && (
                    <div className="mt-3 p-3 bg-red-50 text-red-600 rounded text-xs border border-red-200">
                      Error loading queries: {queries.error}
                    </div>
                  )}
                </div>

                {/* Interaction Stats Card */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <IdentificationIcon size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">LR - Re-Attempts Interactions</div>
                  </div>
                  <InteractionDonut
                    data={interactionStats.data}
                    loading={interactionStats.loading}
                    error={interactionStats.error}
                    totalAttempts={totalAttempts}
                  />
                </div>
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart size={16} className="text-[#8DC63F]" />
                      <div className="text-base font-semibold text-gray-700">
                        Learning Path Progress
                      </div>

                      {/* Dropdowns aligned to the right in the same row */}
                      <div className="ml-auto flex items-center gap-2">
                        <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
                          <option value="">All Courses</option>
                          <option value="course1">Course 1</option>
                          <option value="course2">Course 2</option>
                        </select>

                        <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
                          <option value="">All Time</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                        </select>
                      </div>
                    </div>

                    <div>
                        
                    </div>
                  </div>
              </div>

              {/* ── Right Panel ──────────────────────────────── */}
              <div className="col-span-1 flex flex-col gap-4">

                {/* Batch Info */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-gray-500 font-semibold mb-3">Associated Batch</div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : individualTraineeProfile.currentBatches[0] ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Batch Name</div>
                        <div className="font-semibold text-gray-700">
                          {individualTraineeProfile.currentBatches[0]?.batch_name || 'N/A'}
                        </div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Valid Till</div>
                        <div className="font-semibold text-gray-700">
                          {formatDateTime(individualTraineeProfile.currentBatches[0]?.batch_end_date)}
                        </div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Status</div>
                        <div className="font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${individualTraineeProfile.currentBatches[0]?.batch_status === 'current'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                            }`}>
                            {individualTraineeProfile.currentBatches[0]?.batch_status || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Instructors</div>
                        <div className="font-semibold text-gray-700 text-xs">
                          {individualTraineeProfile.currentBatches[0]?.instructors?.join(', ') || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">No batch assigned</div>
                  )}
                </div>

                {/* Overall Progress */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-gray-500 font-semibold mb-3">Overall Progress</div>
                  <div className="flex justify-center items-center">
                    <OverallCompletion data={{ totalResources, completed, attempted }} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-lg font-bold text-gray-700">{totalResources}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Completed</div>
                      <div className="text-lg font-bold text-[#8DC63F]">{completed}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Tests Done</div>
                      <div className="text-lg font-bold text-blue-500">{attempted}</div>
                    </div>
                  </div>
                </div>
                {/* ? last completed module  */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-gray-500 font-semibold mb-3">Last Completed Module</div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : allResources.filter(r => r.is_completed === true).length > 0 ? (  
                    (() => {
                      const lastCompleted = allResources
                        .filter(r => r.is_completed === true) 
                        .sort((a, b) => new Date(b.completed_on) - new Date(a.completed_on))[0];
                      return (
                        <div className="text-sm p-2 bg-gray-50 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Module Name</div>
                          <div className="font-semibold text-gray-700">
                            {lastCompleted.resource_name || 'N/A'}
                          </div>
                          <div className="text-gray-400 text-xs mt-2">Completed On</div>
                          <div className="font-semibold text-gray-700">
                            {formatDateTime(lastCompleted.updated_at)}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">No modules completed yet</div>
                   )  
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TraineeDashboard;