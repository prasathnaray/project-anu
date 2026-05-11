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

//working pakkkaaaa
// import React, { useState, useEffect, useMemo } from 'react';
// import NavBar from '../navBar';
// import SideBar from '../sideBar';
// import { useNavigate, useParams } from 'react-router-dom';
// import OverallCompletion from '../../charts/OverallCompletion';
// import { GetQueriesAPI } from '../../API/GetQueriesAPI';
// import {
//   BookOpen, Dumbbell, Eye, ClipboardCheck, MessageSquare,
//   CheckCircle, AlertCircle, BarChart, ArrowRight, Award,
//   Target, Flame, TrendingUp,
// } from 'lucide-react';
// import { IdentificationIcon } from 'hugeicons-react';
// import TraineeProfileAPI from '../../API/TraineeProfileAPI';
// import getInteractionsAttemptStats from '../../API/InteractionAttemptAPI';
// import InteractionDonut from '../../charts/InteractionDonut';
// import {
//   startOfWeek, endOfWeek, subWeeks, isWithinInterval, format,
// } from 'date-fns';

// function TraineeDashboard() {
//   const navigate = useNavigate();
//   const { people_id } = useParams();
//   const [buttonOpen, setButtonOpen] = useState(true);

//   // ── Trainee Profile ──────────────────────────────────────
//   const [loading, setLoading] = useState(false);
//   const [individualTraineeProfile, setIndividualTraineeProfile] = useState({
//     data: [],
//     instructors: [],
//     currentBatches: [],
//     completedBatches: [],
//     certificates: [],
//     testQuery: [],
//     reAttempts: [],
//     moduleCompletion: [],
//     nextModule: null,
//     latestProgress: null,
//   });

//   const handleApiCall = async (id) => {
//     try {
//       setLoading(true);
//       const response = await TraineeProfileAPI(id);
//       setIndividualTraineeProfile(response.data);
//       const batchId = response.data?.currentBatches?.[0]?.batch_id;
//       if (batchId) localStorage.setItem('batch_id', batchId);
//     } catch (error) {
//       console.error('Error fetching trainee profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const resolvedId = people_id || localStorage.getItem('people_id');
//     handleApiCall(resolvedId);
//   }, []);

//   // ── Queries ───────────────────────────────────────────────
//   const [queries, setQueries] = useState({
//     pending: 0, resolved: 0, total: 0, loading: false, error: null,
//   });

//   const handleFetchQueries = async () => {
//     try {
//       setQueries(prev => ({ ...prev, loading: true }));
//       const token = localStorage.getItem('user_token');
//       const response = await GetQueriesAPI(token);
//       const pendingCount  = response.result.filter(q => q.status === 'pending').length;
//       const resolvedCount = response.result.filter(q => q.status === 'resolved').length;
//       setQueries({ pending: pendingCount, resolved: resolvedCount, total: response.total, loading: false, error: null });
//     } catch (error) {
//       console.error('Error fetching queries:', error);
//       setQueries(prev => ({ ...prev, loading: false, error: error.message }));
//     }
//   };

//   useEffect(() => { handleFetchQueries(); }, []);

//   // ── Interaction Stats ─────────────────────────────────────
//   const [interactionStats, setInteractionStats] = useState({
//     data: [], loading: false, error: null,
//   });

//   const handleFetchInteractionStats = async () => {
//     try {
//       setInteractionStats(prev => ({ ...prev, loading: true }));
//       const response = await getInteractionsAttemptStats();
//       const data = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : Array.isArray(response?.result)
//         ? response.result
//         : [];
//       setInteractionStats({ data, loading: false, error: null });
//     } catch (error) {
//       console.error('Error fetching interaction stats:', error);
//       setInteractionStats(prev => ({ ...prev, loading: false, error: error.message }));
//     }
//   };

//   useEffect(() => { handleFetchInteractionStats(); }, []);

//   // ── Derived values ────────────────────────────────────────
//   const allResources = useMemo(
//     () => (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null),
//     [individualTraineeProfile.data]
//   );

//   const totalLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource').length, [allResources]);
//   const totalPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice').length, [allResources]);
//   const totalTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test').length, [allResources]);
//   const totalIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation').length, [allResources]);

//   const completedLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource' && r.is_completed === true).length, [allResources]);
//   const completedPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice' && r.is_completed === true).length, [allResources]);
//   const completedTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test' && r.is_completed === true).length, [allResources]);
//   const completedIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation' && r.is_completed === true).length, [allResources]);

//   const totalResources = allResources.length;
//   const completed      = useMemo(() => allResources.filter(r => r.is_completed === true).length, [allResources]);
//   const attempted      = (individualTraineeProfile?.testQuery ?? []).length;
//   const totalAttempts  = interactionStats.data.reduce((sum, r) => sum + Number(r.attempt_count), 0);

//   const nextModule = individualTraineeProfile?.nextModule ?? null;
//   const nextModuleLRPct = nextModule
//     ? Math.round((Number(nextModule.completed_learning_resources) / Number(nextModule.total_learning_resources)) * 100) || 0
//     : 0;
//   const nextModuleIRPct = nextModule
//     ? Math.round((Number(nextModule.completed_image_interpretations) / Number(nextModule.total_image_interpretations)) * 100) || 0
//     : 0;

//   // ── Last Completed Module ─────────────────────────────────
//   // Groups resources by learning_module_id; finds the module with the most
//   // recently completed resource (module does not need to be 100% done).
//   const lastCompletedModuleData = useMemo(() => {
//     const moduleMap = {};
//     allResources.forEach(r => {
//       if (!r.learning_module_id) return;
//       const key = r.learning_module_id;
//       if (!moduleMap[key]) {
//         moduleMap[key] = {
//           learning_module_id: r.learning_module_id,
//           unit_name: r.unit_name,
//           module_name: r.module_name,
//           course_name: r.course_name,
//           resources: [],
//         };
//       }
//       moduleMap[key].resources.push(r);
//     });

//     // Find module with at least one completed resource, pick latest updated_at
//     const modulesWithCompletion = Object.values(moduleMap)
//       .map(m => {
//         const completedResources = m.resources.filter(r => r.is_completed === true && r.updated_at);
//         const totalCount     = m.resources.filter(r => r.resource_id).length;
//         const completedCount = completedResources.length;
//         const lastDate = completedResources
//           .map(r => new Date(r.updated_at))
//           .sort((a, b) => b - a)[0] ?? null;
//         return { ...m, completedCount, totalCount, lastDate };
//       })
//       .filter(m => m.completedCount > 0 && m.lastDate)
//       .sort((a, b) => b.lastDate - a.lastDate);

//     return modulesWithCompletion[0] ?? null;
//   }, [allResources]);

//   // ── Weekly Practice Streak ────────────────────────────────
//   const weeklyStreak = useMemo(() => {
//     const completedDates = allResources
//       .filter(r => r.is_completed === true && r.updated_at)
//       .map(r => new Date(r.updated_at));

//     if (completedDates.length === 0) return 0;

//     const now = new Date();
//     const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
//     const thisWeekEnd   = endOfWeek(now, { weekStartsOn: 1 });
//     const hasThisWeek   = completedDates.some(d => isWithinInterval(d, { start: thisWeekStart, end: thisWeekEnd }));

//     let streak = 0;
//     // If no activity this week, start counting from last week
//     const startOffset = hasThisWeek ? 0 : 1;

//     for (let i = startOffset; i < 52; i++) {
//       const wStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
//       const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
//       if (completedDates.some(d => isWithinInterval(d, { start: wStart, end: wEnd }))) {
//         streak++;
//       } else {
//         break;
//       }
//     }
//     return streak;
//   }, [allResources]);

//   // ── Last 8 Weeks Activity (bar chart for streak card) ────
//   const last8WeeksActivity = useMemo(() => {
//     const completedDates = allResources
//       .filter(r => r.is_completed === true && r.updated_at)
//       .map(r => new Date(r.updated_at));

//     return Array.from({ length: 8 }, (_, i) => {
//       const wStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
//       const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
//       const count  = completedDates.filter(d => isWithinInterval(d, { start: wStart, end: wEnd })).length;
//       return {
//         week: format(wStart, 'MMM d'),
//         count,
//         isCurrentWeek: i === 7,
//       };
//     });
//   }, [allResources]);

//   // ── Test Scores & Reattempts ──────────────────────────────
//   const testScores    = (individualTraineeProfile?.testQuery ?? [])[0] ?? null;
//   const testReattempts = useMemo(() => individualTraineeProfile?.reAttempts ?? [], [individualTraineeProfile.reAttempts]);
//   const moduleCompletion = useMemo(() => individualTraineeProfile?.moduleCompletion ?? [], [individualTraineeProfile.moduleCompletion]);

//   // ── MS — MindSparks ───────────────────────────────────────
//   const msTotalAttempts  = totalAttempts;
//   const msResourceCount  = interactionStats.data.length;

//   // ── OB — OB Booster resources ────────────────────────────
//   const obResources = useMemo(() =>
//     allResources.filter(r =>
//       r.resource_topic?.toLowerCase().includes('ob booster') ||
//       r.resource_name?.toLowerCase().includes('ob booster') ||
//       r.resource_topic?.toLowerCase().includes('ob boosters')
//     ), [allResources]);
//   const obCompleted = obResources.filter(r => r.is_completed === true).length;

//   // ── Practice & Test resource lists ───────────────────────
//   const practiceResources = useMemo(() => {
//     const seen = new Set();
//     return allResources
//       .filter(r => r.resource_type === 'Practice' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
//       .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
//   }, [allResources]);

//   const testResourcesList = useMemo(() => {
//     const seen = new Set();
//     return allResources
//       .filter(r => r.resource_type === 'Test' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
//       .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
//   }, [allResources]);

//   // P1–P4 practices, T1–T4 tests with reattempt counts
//   const resourcePerformanceItems = useMemo(() => {
//     const practices = practiceResources.slice(0, 4).map((r, i) => ({
//       label: `P${i + 1}`,
//       resource_name: r.resource_name,
//       resource_type: 'Practice',
//       resource_id: r.resource_id,
//       is_completed: r.is_completed,
//       updated_at: r.updated_at,
//       reattempts: 0,
//     }));
//     const tests = testResourcesList.slice(0, 4).map((r, i) => {
//       const entry = testReattempts.find(ra => ra.resource_id === r.resource_id);
//       return {
//         label: `T${i + 1}`,
//         resource_name: r.resource_name,
//         resource_type: 'Test',
//         resource_id: r.resource_id,
//         is_completed: r.is_completed,
//         updated_at: r.updated_at,
//         reattempts: entry ? Math.max(0, Number(entry.attempt_count) - 1) : 0,
//       };
//     });
//     return [...practices, ...tests];
//   }, [practiceResources, testResourcesList, testReattempts]);

//   // ── Learning Path Progress (group by course) ─────────────
//   const learningPathProgress = useMemo(() => {
//     const courseMap = {};
//     moduleCompletion.forEach(m => {
//       const key = m.course_name || 'Unknown Course';
//       if (!courseMap[key]) courseMap[key] = { course_name: key, modules: [] };
//       courseMap[key].modules.push(m);
//     });
//     return Object.values(courseMap);
//   }, [moduleCompletion]);

//   // ── Helpers ───────────────────────────────────────────────
//   const formatDateTime = (ds) => {
//     if (!ds || ds === 'N/A') return 'N/A';
//     const d = new Date(ds);
//     if (isNaN(d.getTime())) return 'N/A';
//     return d.toLocaleString('en-IN', {
//       year: 'numeric', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
//     });
//   };

//   const formatDate = (ds) => {
//     if (!ds || ds === 'N/A') return 'N/A';
//     const d = new Date(ds);
//     if (isNaN(d.getTime())) return 'N/A';
//     return d.toLocaleDateString('en-IN', {
//       year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata',
//     });
//   };

//   const calcAvgScore = (scores) => {
//     if (!scores) return null;
//     const vals = [
//       scores.plane_identification, scores.image_optimization,
//       scores.measurement, scores.diagnostic_interpretation,
//     ].map(Number).filter(v => !isNaN(v));
//     return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
//   };

//   // ── Sub-components ────────────────────────────────────────
//   const Spinner = ({ color = '#8DC63F', size = 5 }) => (
//     <div
//       className={`w-${size} h-${size} border-2 border-t-transparent rounded-full animate-spin`}
//       style={{ borderColor: `${color} transparent transparent transparent` }}
//     />
//   );

//   const StatCard = ({ icon: Icon, iconColor, label, completed: c, total: t }) => {
//     const pct = t > 0 ? Math.round((c / t) * 100) : 0;
//     return (
//       <div className="border shadow-sm rounded-lg p-3 bg-white flex flex-col gap-2">
//         <div className="flex justify-between items-center">
//           <div className="p-2 rounded-lg bg-gray-50">
//             <Icon size={20} className={iconColor} />
//           </div>
//           <div className="text-right">
//             <div className="text-xs text-gray-400">{label}</div>
//             {loading ? (
//               <div className="flex justify-end mt-1"><Spinner /></div>
//             ) : (
//               <div className="text-xl font-bold text-gray-700">
//                 {c}<span className="text-sm font-normal text-gray-400">/{t}</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="w-full bg-gray-100 rounded-full h-1.5">
//           <div className="h-1.5 rounded-full transition-all duration-500"
//             style={{ width: `${pct}%`, backgroundColor: '#8DC63F' }} />
//         </div>
//         <div className="text-[10px] text-gray-400">{pct}% completed</div>
//       </div>
//     );
//   };

//   const ScoreBadge = ({ label, value, color, subLabel }) => (
//     <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-gray-50 gap-1 min-h-[90px]">
//       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
//       {loading ? <Spinner size={4} /> : (
//         <div className="text-2xl font-bold" style={{ color }}>
//           {value !== null && value !== undefined ? value : '—'}
//         </div>
//       )}
//       {subLabel && <div className="text-[9px] text-gray-400 text-center leading-tight">{subLabel}</div>}
//     </div>
//   );

//   // ── Render ────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">
//         <div>
//           <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />
//         </div>

//         <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
//           <div className="p-4">
//             <div className="grid grid-cols-3 gap-5">
//               <div className="col-span-2 flex flex-col gap-4">
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="text-xl pt-1 font-semibold text-gray-700">
//                     Welcome Back, {individualTraineeProfile.data[0]?.user_name || 'NA'}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   <StatCard icon={BookOpen}      iconColor="text-blue-500"   label="Learning Resources"   completed={completedLR}       total={totalLR} />
//                   <StatCard icon={Dumbbell}       iconColor="text-green-500"  label="Practices"             completed={completedPractice} total={totalPractice} />
//                   <StatCard icon={ClipboardCheck} iconColor="text-orange-500" label="Tests"                 completed={completedTests}    total={totalTests} />
//                   <StatCard icon={Eye}            iconColor="text-purple-500" label="Image Interpretations" completed={completedIR}       total={totalIR} />
//                 </div>
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Award size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Last Score</div>
//                     {testScores && (
//                       <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
//                         Last test: {formatDate(testScores.created_at)}
//                       </span>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-4 gap-3">
//                     <ScoreBadge
//                       label="MS"
//                       value={msTotalAttempts}
//                       color="#8DC63F"
//                       subLabel={`MindSpark Attempts${msResourceCount > 0 ? ` (${msResourceCount} resources)` : ''}`}
//                     />
//                     <ScoreBadge
//                       label="OB"
//                       value={obResources.length > 0 ? `${obCompleted}/${obResources.length}` : '—'}
//                       color="#f97316"
//                       subLabel="OB Booster"
//                     />
//                     <ScoreBadge
//                       label="II"
//                       value={totalIR > 0 ? `${completedIR}/${totalIR}` : '—'}
//                       color="#a78bfa"
//                       subLabel="Image Interp."
//                     />
//                     <ScoreBadge
//                       label="T"
//                       value={testScores ? `${calcAvgScore(testScores) ?? '—'}%` : '—'}
//                       color="#3b82f6"
//                       subLabel={testScores ? (testScores.resource_name || 'Last Test') : 'No test yet'}
//                     />
//                   </div>

//                   {/* Test sub-scores breakdown */}
//                   {testScores && (
//                     <div className="mt-4 pt-3 border-t border-gray-100">
//                       <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
//                         Last Test — Sub-Scores
//                       </div>
//                       <div className="grid grid-cols-2 gap-x-6 gap-y-2">
//                         {[
//                           { key: 'plane_identification',       label: 'Plane Identification', color: '#3b82f6' },
//                           { key: 'image_optimization',         label: 'Image Optimization',   color: '#8b5cf6' },
//                           { key: 'measurement',                label: 'Measurement',          color: '#10b981' },
//                           { key: 'diagnostic_interpretation',  label: 'Diagnostic Interp.',   color: '#f59e0b' },
//                         ].map(({ key, label, color }) => {
//                           const val = Number(testScores[key]);
//                           const pct = isNaN(val) ? 0 : Math.min(100, Math.round(val));
//                           return (
//                             <div key={key} className="flex flex-col gap-1">
//                               <div className="flex justify-between text-[10px] text-gray-500">
//                                 <span>{label}</span>
//                                 <span className="font-semibold" style={{ color }}>
//                                   {isNaN(val) ? '—' : `${val}%`}
//                                 </span>
//                               </div>
//                               <div className="w-full bg-gray-100 rounded-full h-1.5">
//                                 <div className="h-1.5 rounded-full transition-all duration-700"
//                                   style={{ width: `${pct}%`, backgroundColor: color }} />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* ── PRACTICE & TEST PERFORMANCE (P1–P4, T1–T4) ── */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Target size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Practice &amp; Test Performance</div>
//                   </div>

//                   {loading ? (
//                     <div className="flex justify-center py-6"><Spinner /></div>
//                   ) : resourcePerformanceItems.length > 0 ? (
//                     <>
//                       <div className="overflow-x-auto">
//                         <table className="w-full text-sm border-collapse">
//                           <thead>
//                             <tr className="border-b border-gray-100 bg-gray-50">
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold rounded-tl">#</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Resource</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Type</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Status</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Last Attempted</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold rounded-tr">Re-Attempts</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {resourcePerformanceItems.map((item, idx) => (
//                               <tr key={item.resource_id || idx}
//                                 className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
//                                 <td className="py-2 px-2">
//                                   <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                                     item.resource_type === 'Practice'
//                                       ? 'bg-green-100 text-green-700'
//                                       : 'bg-blue-100 text-blue-700'
//                                   }`}>
//                                     {item.label}
//                                   </span>
//                                 </td>
//                                 <td className="py-2 px-2 text-gray-700 font-medium max-w-[180px] truncate" title={item.resource_name}>
//                                   {item.resource_name || 'N/A'}
//                                 </td>
//                                 <td className="py-2 px-2">
//                                   <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                     item.resource_type === 'Practice'
//                                       ? 'bg-green-50 text-green-600'
//                                       : 'bg-blue-50 text-blue-600'
//                                   }`}>
//                                     {item.resource_type}
//                                   </span>
//                                 </td>
//                                 <td className="py-2 px-2">
//                                   {item.is_completed ? (
//                                     <span className="flex items-center gap-1 text-xs text-green-600">
//                                       <CheckCircle size={11} /> Done
//                                     </span>
//                                   ) : item.updated_at ? (
//                                     <span className="text-xs text-orange-500">In Progress</span>
//                                   ) : (
//                                     <span className="text-xs text-gray-400">Not Started</span>
//                                   )}
//                                 </td>
//                                 <td className="py-2 px-2 text-xs text-gray-500">
//                                   {item.updated_at ? formatDate(item.updated_at) : '—'}
//                                 </td>
//                                 <td className="py-2 px-2">
//                                   {item.reattempts > 0 ? (
//                                     <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
//                                       {item.reattempts}×
//                                     </span>
//                                   ) : (
//                                     <span className="text-xs text-gray-300">—</span>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Overall Test Re-Attempts */}
//                       {testReattempts.length > 0 && (
//                         <div className="mt-4 pt-3 border-t border-gray-100">
//                           <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
//                             Overall — No. of Re-Attempts
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {testReattempts.map((r, i) => (
//                               <div key={i}
//                                 className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 text-xs">
//                                 <span className="text-gray-600 font-medium truncate max-w-[140px]" title={r.resource_name}>
//                                   {r.resource_name}
//                                 </span>
//                                 <span className="text-orange-600 font-bold">{r.attempt_count}×</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-6">
//                       No practice or test data available yet
//                     </div>
//                   )}
//                 </div>

//                 {/* Queries */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <MessageSquare size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Queries Raised</div>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3">
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="text-sm text-gray-500">Total</div>
//                       <div className="text-2xl font-bold text-[#8DC63F]">
//                         {queries.loading ? <Spinner color="#8DC63F" /> : queries.total}
//                       </div>
//                     </div>
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="flex items-center gap-1.5">
//                         <AlertCircle size={14} className="text-orange-400" />
//                         <div className="text-sm text-gray-500">Pending</div>
//                       </div>
//                       <div className="text-2xl font-bold text-orange-500">
//                         {queries.loading ? <Spinner color="#f97316" /> : queries.pending}
//                       </div>
//                     </div>
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="flex items-center gap-1.5">
//                         <CheckCircle size={14} className="text-green-500" />
//                         <div className="text-sm text-gray-500">Resolved</div>
//                       </div>
//                       <div className="text-2xl font-bold text-green-600">
//                         {queries.loading ? <Spinner color="#16a34a" /> : queries.resolved}
//                       </div>
//                     </div>
//                   </div>
//                   {queries.error && (
//                     <div className="mt-3 p-3 bg-red-50 text-red-600 rounded text-xs border border-red-200">
//                       Error loading queries: {queries.error}
//                     </div>
//                   )}
//                 </div>

//                 {/* LR Re-Attempts Interactions */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <IdentificationIcon size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">LR — Re-Attempts Interactions</div>
//                   </div>
//                   <InteractionDonut
//                     data={interactionStats.data}
//                     loading={interactionStats.loading}
//                     error={interactionStats.error}
//                     totalAttempts={totalAttempts}
//                   />
//                 </div>

//                 {/* ── LEARNING PATH PROGRESS ───────────────────── */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <TrendingUp size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Learning Path Progress</div>
//                     {moduleCompletion.length > 0 && (
//                       <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
//                         {moduleCompletion.filter(m => {
//                           const total = Number(m.total_learning_resources) + Number(m.total_image_interpretations);
//                           const done  = Number(m.completed_learning_resources) + Number(m.completed_image_interpretations);
//                           return total > 0 && done === total;
//                         }).length} / {moduleCompletion.length} modules done
//                       </span>
//                     )}
//                   </div>

//                   {loading ? (
//                     <div className="flex justify-center py-6"><Spinner /></div>
//                   ) : learningPathProgress.length > 0 ? (
//                     <div className="flex flex-col gap-5">
//                       {learningPathProgress.map((course, ci) => (
//                         <div key={ci}>
//                           <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2 pb-1 border-b border-gray-100">
//                             <BookOpen size={13} className="text-blue-400" />
//                             {course.course_name}
//                           </div>
//                           <div className="flex flex-col gap-2">
//                             {course.modules.map((mod, mi) => {
//                               const lrTotal = Number(mod.total_learning_resources)    || 0;
//                               const lrDone  = Number(mod.completed_learning_resources) || 0;
//                               const iiTotal = Number(mod.total_image_interpretations)  || 0;
//                               const iiDone  = Number(mod.completed_image_interpretations) || 0;
//                               const total   = lrTotal + iiTotal;
//                               const done    = lrDone  + iiDone;
//                               const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
//                               const isDone  = total > 0 && done === total;
//                               return (
//                                 <div key={mi}
//                                   className={`rounded-lg border p-3 transition-colors ${
//                                     isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
//                                   }`}>
//                                   <div className="flex justify-between items-start mb-1.5">
//                                     <div className="flex flex-col gap-0.5">
//                                       <span className="text-xs font-semibold text-gray-700">
//                                         {mod.unit_name || mod.module_name || 'Module'}
//                                       </span>
//                                       {mod.unit_name && mod.module_name && (
//                                         <span className="text-[10px] text-gray-400">{mod.module_name}</span>
//                                       )}
//                                     </div>
//                                     <div className="flex items-center gap-1.5 ml-2 shrink-0">
//                                       {isDone && <CheckCircle size={12} className="text-green-500" />}
//                                       <span className={`text-xs font-bold ${isDone ? 'text-green-600' : 'text-gray-600'}`}>
//                                         {pct}%
//                                       </span>
//                                     </div>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                     <div className="h-1.5 rounded-full transition-all duration-700"
//                                       style={{
//                                         width: `${pct}%`,
//                                         backgroundColor: isDone ? '#22c55e' : '#8DC63F',
//                                       }} />
//                                   </div>
//                                   <div className="flex gap-4 mt-1.5 text-[10px] text-gray-400">
//                                     <span>LR: <span className="text-gray-600 font-medium">{lrDone}/{lrTotal}</span></span>
//                                     <span>II: <span className="text-gray-600 font-medium">{iiDone}/{iiTotal}</span></span>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-6">
//                       No learning path data available
//                     </div>
//                   )}
//                 </div>

//               </div>

//               {/* ── RIGHT PANEL ──────────────────────────────── */}
//               <div className="col-span-1 flex flex-col gap-4">

//                 {/* Associated Batch */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="text-gray-500 font-semibold mb-3">Associated Batch</div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : individualTraineeProfile.currentBatches[0] ? (
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Batch Name</div>
//                         <div className="font-semibold text-gray-700">
//                           {individualTraineeProfile.currentBatches[0]?.batch_name || 'N/A'}
//                         </div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Valid Till</div>
//                         <div className="font-semibold text-gray-700">
//                           {formatDateTime(individualTraineeProfile.currentBatches[0]?.batch_end_date)}
//                         </div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Status</div>
//                         <div className="font-semibold">
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
//                             individualTraineeProfile.currentBatches[0]?.batch_status === 'current'
//                               ? 'bg-green-100 text-green-600'
//                               : 'bg-gray-100 text-gray-500'
//                           }`}>
//                             {individualTraineeProfile.currentBatches[0]?.batch_status || 'N/A'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Instructors</div>
//                         <div className="font-semibold text-gray-700 text-xs">
//                           {individualTraineeProfile.currentBatches[0]?.instructors?.join(', ') || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">No batch assigned</div>
//                   )}
//                 </div>

//                 {/* Overall Progress */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="text-gray-500 font-semibold mb-3">Overall Progress</div>
//                   <div className="flex justify-center items-center">
//                     <OverallCompletion data={{ totalResources, completed, attempted }} />
//                   </div>
//                   <div className="mt-3 grid grid-cols-3 gap-2 text-center">
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Total</div>
//                       <div className="text-lg font-bold text-gray-700">{totalResources}</div>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Completed</div>
//                       <div className="text-lg font-bold text-[#8DC63F]">{completed}</div>
//                     </div>
//                     <div className="bg-blue-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Tests Done</div>
//                       <div className="text-lg font-bold text-blue-500">{attempted}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── LAST COMPLETED MODULE ─────────────────── */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-3">
//                     <CheckCircle size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Last Completed Module</div>
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : lastCompletedModuleData ? (
//                     <div className="flex flex-col gap-2">
//                       <div className="text-sm p-2 bg-green-50 rounded-lg border border-green-100">
//                         <div className="text-gray-400 text-xs mb-1">Unit</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.unit_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Module</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.module_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Course</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.course_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Last Activity</div>
//                         <div className="font-semibold text-gray-700">{formatDateTime(lastCompletedModuleData.lastDate)}</div>
//                       </div>
//                       {/* Mini progress bar */}
//                       <div className="flex flex-col gap-1 pt-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Resources Completed</span>
//                           <span className="font-semibold text-gray-500">
//                             {lastCompletedModuleData.completedCount}/{lastCompletedModuleData.totalCount}
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{
//                               width: `${lastCompletedModuleData.totalCount > 0
//                                 ? Math.round((lastCompletedModuleData.completedCount / lastCompletedModuleData.totalCount) * 100)
//                                 : 0}%`,
//                               backgroundColor: '#8DC63F',
//                             }} />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">No module activity yet</div>
//                   )}
//                 </div>

//                 {/* ── PRACTICE STREAK — WEEKLY ──────────────── */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Flame size={16} className="text-orange-500" />
//                     <div className="text-gray-500 font-semibold">Practice Streak</div>
//                     <div className="ml-auto flex items-center gap-1">
//                       <span className="text-2xl font-bold text-orange-500">{weeklyStreak}</span>
//                       <span className="text-xs text-gray-400 leading-tight">
//                         week{weeklyStreak !== 1 ? 's' : ''}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-[10px] text-gray-400 mb-3">Weekly activity — last 8 weeks</div>

//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : (
//                     <>
//                       <div className="flex items-end gap-1 h-14">
//                         {last8WeeksActivity.map((week, i) => {
//                           const maxCount = Math.max(...last8WeeksActivity.map(w => w.count), 1);
//                           const heightPct = week.count === 0 ? 15 : Math.max(20, Math.round((week.count / maxCount) * 100));
//                           return (
//                             <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
//                               <div
//                                 className={`w-full rounded-t transition-all duration-500 ${
//                                   week.isCurrentWeek ? 'ring-1 ring-orange-400' : ''
//                                 }`}
//                                 style={{
//                                   height: `${heightPct}%`,
//                                   backgroundColor: week.count === 0
//                                     ? '#e5e7eb'
//                                     : week.count <= 3
//                                     ? '#bbf7d0'
//                                     : week.count <= 7
//                                     ? '#8DC63F'
//                                     : '#16a34a',
//                                 }}
//                                 title={`${week.week}: ${week.count} completion${week.count !== 1 ? 's' : ''}`}
//                               />
//                             </div>
//                           );
//                         })}
//                       </div>
//                       <div className="flex justify-between mt-1.5 text-[9px] text-gray-400 px-0.5">
//                         {last8WeeksActivity.map((week, i) => (
//                           <span key={i} className={`flex-1 text-center ${week.isCurrentWeek ? 'text-orange-500 font-semibold' : ''}`}>
//                             {week.week.split(' ')[0]}
//                           </span>
//                         ))}
//                       </div>
//                       {weeklyStreak === 0 && (
//                         <div className="mt-2 text-xs text-center text-gray-400 bg-gray-50 rounded-lg py-2">
//                           Complete a resource this week to start your streak!
//                         </div>
//                       )}
//                       {weeklyStreak >= 3 && (
//                         <div className="mt-2 text-xs text-center text-orange-500 font-semibold bg-orange-50 rounded-lg py-2">
//                           {weeklyStreak >= 8 ? 'Incredible streak!' : weeklyStreak >= 5 ? 'Great consistency!' : 'Keep it up!'}
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Next Module */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-3">
//                     <ArrowRight size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Next Module</div>
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : nextModule ? (
//                     <div className="flex flex-col gap-2">
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Unit</div>
//                         <div className="font-semibold text-gray-700">{nextModule.unit_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Module</div>
//                         <div className="font-semibold text-gray-700">{nextModule.module_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Course</div>
//                         <div className="font-semibold text-gray-700">{nextModule.course_name || 'N/A'}</div>
//                       </div>
//                       <div className="flex flex-col gap-1 pt-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Learning Resources</span>
//                           <span>{nextModule.completed_learning_resources}/{nextModule.total_learning_resources}</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{ width: `${nextModuleLRPct}%`, backgroundColor: '#8DC63F' }} />
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Image Interpretations</span>
//                           <span>{nextModule.completed_image_interpretations}/{nextModule.total_image_interpretations}</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{ width: `${nextModuleIRPct}%`, backgroundColor: '#a78bfa' }} />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">All modules completed!</div>
//                   )}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TraineeDashboard;



//new test

// TraineeDashboard.jsx — with Performance Metrics, Skill Competency, Last Session Breakdown

// import React, { useState, useEffect, useMemo } from 'react';
// import NavBar from '../navBar';
// import SideBar from '../sideBar';
// import { useNavigate, useParams } from 'react-router-dom';
// import OverallCompletion from '../../charts/OverallCompletion';
// import { GetQueriesAPI } from '../../API/GetQueriesAPI';
// import {
//   BookOpen, Dumbbell, Eye, ClipboardCheck, MessageSquare,
//   CheckCircle, AlertCircle, BarChart, ArrowRight, Award,
//   Target, Flame, TrendingUp, Activity, Zap, Brain,
//   ChevronUp, ChevronDown, Minus, Clock, XCircle,
// } from 'lucide-react';
// import { IdentificationIcon } from 'hugeicons-react';
// import TraineeProfileAPI from '../../API/TraineeProfileAPI';
// import getInteractionsAttemptStats from '../../API/InteractionAttemptAPI';
// import getActivityLastScores from '../../API/ActivityLastScoresAPI';
// import InteractionDonut from '../../charts/InteractionDonut';
// import {
//   startOfWeek, endOfWeek, subWeeks, isWithinInterval, format,
// } from 'date-fns';

// // ─────────────────────────────────────────────────────────────
// // MOCK DATA — swap these out for real API responses later
// // ─────────────────────────────────────────────────────────────

// const MOCK_PERFORMANCE_METRICS = {
//   accuracy: { value: 78, prev: 70, unit: '%' },
//   timePerTask: { value: 4.2, prev: 5.1, unit: ' min' },
//   errorRate: { value: 18, prev: 24, unit: '%' },
//   consistency: 'Medium', // 'Low' | 'Medium' | 'High'
// };

// const MOCK_SKILL_COMPETENCY = [
//   { skill: 'Probe Handling',         level: 'Intermediate', score: 62, trend: 'up' },
//   { skill: 'Plane Acquisition',      level: 'Advanced',     score: 84, trend: 'up' },
//   { skill: 'Fetal Biometry',         level: 'Intermediate', score: 58, trend: 'neutral' },
//   { skill: 'Anatomy Identification', level: 'Beginner',     score: 34, trend: 'down' },
// ];

// const MOCK_LAST_SESSION = {
//   module: 'Biometry — AC, P3',
//   date: '2025-04-30T10:22:00',
//   checks: [
//     { label: 'Correct Plane Acquired',   passed: true },
//     { label: 'Landmark Misidentified',   passed: false },
//     { label: 'Measurement Offset +2.3mm', passed: false },
//   ],
//   feedback: 'Adjust probe tilt slightly inferiorly to get a cleaner abdominal circumference plane.',
// };

// function TraineeDashboard() {
//   const navigate = useNavigate();
//   const { people_id } = useParams();
//   const [buttonOpen, setButtonOpen] = useState(true);

//   // ── Trainee Profile ──────────────────────────────────────
//   const [loading, setLoading] = useState(false);
//   const [individualTraineeProfile, setIndividualTraineeProfile] = useState({
//     data: [],
//     instructors: [],
//     currentBatches: [],
//     completedBatches: [],
//     certificates: [],
//     testQuery: [],
//     reAttempts: [],
//     moduleCompletion: [],
//     nextModule: null,
//     latestProgress: null,
//   });

//   const handleApiCall = async (id) => {
//     try {
//       setLoading(true);
//       const response = await TraineeProfileAPI(id);
//       setIndividualTraineeProfile(response.data);
//       const batchId = response.data?.currentBatches?.[0]?.batch_id;
//       if (batchId) localStorage.setItem('batch_id', batchId);
//     } catch (error) {
//       console.error('Error fetching trainee profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const resolvedId = people_id || localStorage.getItem('people_id');
//     handleApiCall(resolvedId);
//   }, []);

//   // ── Queries ───────────────────────────────────────────────
//   const [queries, setQueries] = useState({
//     pending: 0, resolved: 0, total: 0, loading: false, error: null,
//   });

//   const handleFetchQueries = async () => {
//     try {
//       setQueries(prev => ({ ...prev, loading: true }));
//       const token = localStorage.getItem('user_token');
//       const response = await GetQueriesAPI(token);
//       const pendingCount  = response.result.filter(q => q.status === 'pending').length;
//       const resolvedCount = response.result.filter(q => q.status === 'resolved').length;
//       setQueries({ pending: pendingCount, resolved: resolvedCount, total: response.total, loading: false, error: null });
//     } catch (error) {
//       console.error('Error fetching queries:', error);
//       setQueries(prev => ({ ...prev, loading: false, error: error.message }));
//     }
//   };

//   useEffect(() => { handleFetchQueries(); }, []);

//   // ── Interaction Stats ─────────────────────────────────────
//   const [interactionStats, setInteractionStats] = useState({
//     data: [], loading: false, error: null,
//   });

//   const handleFetchInteractionStats = async () => {
//     try {
//       setInteractionStats(prev => ({ ...prev, loading: true }));
//       const response = await getInteractionsAttemptStats();
//       const data = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : Array.isArray(response?.result)
//         ? response.result
//         : [];
//       setInteractionStats({ data, loading: false, error: null });
//     } catch (error) {
//       console.error('Error fetching interaction stats:', error);
//       setInteractionStats(prev => ({ ...prev, loading: false, error: error.message }));
//     }
//   };

//   useEffect(() => { handleFetchInteractionStats(); }, []);

//   // ── Activity Last Scores (MS / OB) ────────────────────────
//   const [activityLastScores, setActivityLastScores] = useState({
//     data: [], loading: false, error: null,
//   });

//   const handleFetchActivityLastScores = async () => {
//     try {
//       setActivityLastScores(prev => ({ ...prev, loading: true }));
//       const response = await getActivityLastScores();
//       const data = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];
//       setActivityLastScores({ data, loading: false, error: null });
//     } catch (error) {
//       console.error('Error fetching activity last scores:', error);
//       setActivityLastScores(prev => ({ ...prev, loading: false, error: error.message }));
//     }
//   };

//   useEffect(() => { handleFetchActivityLastScores(); }, []);
//   const allResources = useMemo(
//     () => (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null),
//     [individualTraineeProfile.data]
//   );

//   const totalLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource').length, [allResources]);
//   const totalPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice').length, [allResources]);
//   const totalTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test').length, [allResources]);
//   const totalIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation').length, [allResources]);

//   const completedLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource' && r.is_completed === true).length, [allResources]);
//   const completedPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice' && r.is_completed === true).length, [allResources]);
//   const completedTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test' && r.is_completed === true).length, [allResources]);
//   const completedIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation' && r.is_completed === true).length, [allResources]);

//   const totalResources = allResources.length;
//   const completed      = useMemo(() => allResources.filter(r => r.is_completed === true).length, [allResources]);
//   const attempted      = (individualTraineeProfile?.testQuery ?? []).length;
//   const totalAttempts  = interactionStats.data.reduce((sum, r) => sum + Number(r.attempt_count), 0);

//   const nextModule = individualTraineeProfile?.nextModule ?? null;
//   const nextModuleLRPct = nextModule
//     ? Math.round((Number(nextModule.completed_learning_resources) / Number(nextModule.total_learning_resources)) * 100) || 0
//     : 0;
//   const nextModuleIRPct = nextModule
//     ? Math.round((Number(nextModule.completed_image_interpretations) / Number(nextModule.total_image_interpretations)) * 100) || 0
//     : 0;

//   // ── Last Completed Module ─────────────────────────────────
//   const lastCompletedModuleData = useMemo(() => {
//     const moduleMap = {};
//     allResources.forEach(r => {
//       if (!r.learning_module_id) return;
//       const key = r.learning_module_id;
//       if (!moduleMap[key]) {
//         moduleMap[key] = {
//           learning_module_id: r.learning_module_id,
//           unit_name: r.unit_name,
//           module_name: r.module_name,
//           course_name: r.course_name,
//           resources: [],
//         };
//       }
//       moduleMap[key].resources.push(r);
//     });

//     const modulesWithCompletion = Object.values(moduleMap)
//       .map(m => {
//         const completedResources = m.resources.filter(r => r.is_completed === true && r.updated_at);
//         const totalCount     = m.resources.filter(r => r.resource_id).length;
//         const completedCount = completedResources.length;
//         const lastDate = completedResources
//           .map(r => new Date(r.updated_at))
//           .sort((a, b) => b - a)[0] ?? null;
//         return { ...m, completedCount, totalCount, lastDate };
//       })
//       .filter(m => m.completedCount > 0 && m.lastDate)
//       .sort((a, b) => b.lastDate - a.lastDate);

//     return modulesWithCompletion[0] ?? null;
//   }, [allResources]);

//   // ── Weekly Practice Streak ────────────────────────────────
//   const weeklyStreak = useMemo(() => {
//     const completedDates = allResources
//       .filter(r => r.is_completed === true && r.updated_at)
//       .map(r => new Date(r.updated_at));

//     if (completedDates.length === 0) return 0;

//     const now = new Date();
//     const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
//     const thisWeekEnd   = endOfWeek(now, { weekStartsOn: 1 });
//     const hasThisWeek   = completedDates.some(d => isWithinInterval(d, { start: thisWeekStart, end: thisWeekEnd }));

//     let streak = 0;
//     const startOffset = hasThisWeek ? 0 : 1;

//     for (let i = startOffset; i < 52; i++) {
//       const wStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
//       const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
//       if (completedDates.some(d => isWithinInterval(d, { start: wStart, end: wEnd }))) {
//         streak++;
//       } else {
//         break;
//       }
//     }
//     return streak;
//   }, [allResources]);

//   // ── Last 8 Weeks Activity ─────────────────────────────────
//   const last8WeeksActivity = useMemo(() => {
//     const completedDates = allResources
//       .filter(r => r.is_completed === true && r.updated_at)
//       .map(r => new Date(r.updated_at));

//     return Array.from({ length: 8 }, (_, i) => {
//       const wStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
//       const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
//       const count  = completedDates.filter(d => isWithinInterval(d, { start: wStart, end: wEnd })).length;
//       return { week: format(wStart, 'MMM d'), count, isCurrentWeek: i === 7 };
//     });
//   }, [allResources]);

//   // ── Test Scores & Reattempts ──────────────────────────────
//   const testScores     = (individualTraineeProfile?.testQuery ?? [])[0] ?? null;
//   const testReattempts = useMemo(() => individualTraineeProfile?.reAttempts ?? [], [individualTraineeProfile.reAttempts]);
//   const moduleCompletion = useMemo(() => individualTraineeProfile?.moduleCompletion ?? [], [individualTraineeProfile.moduleCompletion]);

//   const msTotalAttempts = totalAttempts;
//   const msResourceCount = interactionStats.data.length;

//   const obResources = useMemo(() =>
//     allResources.filter(r =>
//       r.resource_topic?.toLowerCase().includes('ob booster') ||
//       r.resource_name?.toLowerCase().includes('ob booster') ||
//       r.resource_topic?.toLowerCase().includes('ob boosters')
//     ), [allResources]);
//   const obCompleted = obResources.filter(r => r.is_completed === true).length;

//   // ── Last-session scores from activity_submissions ─────────
//   // OB Booster: resource_topic / resource_name contains 'ob booster'
//   const isOBRecord = (r) => {
//     const rto = (r.resource_topic || '').toLowerCase();
//     const rn  = (r.resource_name  || '').toLowerCase();
//     const rt  = (r.resource_type  || '').toLowerCase();
//     return rto.includes('ob booster') || rto.includes('ob boosters') ||
//            rn.includes('ob booster')  || rn.includes('ob boosters')  ||
//            rt.includes('ob booster')  || rt.includes('ob boosters');
//   };

//   // MindSpark = every activity record that is NOT an OB Booster
//   const msLastScores = useMemo(() =>
//     activityLastScores.data.filter(r => !isOBRecord(r)),
//   [activityLastScores.data]);

//   const msLastScoreSummary = useMemo(() => {
//     if (!msLastScores.length) return null;
//     const totalQ   = msLastScores.reduce((s, r) => s + Number(r.total_questions || 0), 0);
//     const correct  = msLastScores.reduce((s, r) => s + Number(r.correct_answers || 0), 0);
//     const wrong    = msLastScores.reduce((s, r) => s + Number(r.wrong_answers   || 0), 0);
//     return { totalQ, correct, wrong, resources: msLastScores.length };
//   }, [msLastScores]);

//   // OB Booster
//   const obLastScores = useMemo(() =>
//     activityLastScores.data.filter(r => isOBRecord(r)),
//   [activityLastScores.data]);

//   const obLastScoreSummary = useMemo(() => {
//     if (!obLastScores.length) return null;
//     const totalQ  = obLastScores.reduce((s, r) => s + Number(r.total_questions || 0), 0);
//     const correct = obLastScores.reduce((s, r) => s + Number(r.correct_answers || 0), 0);
//     const wrong   = obLastScores.reduce((s, r) => s + Number(r.wrong_answers   || 0), 0);
//     return { totalQ, correct, wrong, resources: obLastScores.length };
//   }, [obLastScores]);

//   const practiceResources = useMemo(() => {
//     const seen = new Set();
//     return allResources
//       .filter(r => r.resource_type === 'Practice' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
//       .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
//   }, [allResources]);

//   const testResourcesList = useMemo(() => {
//     const seen = new Set();
//     return allResources
//       .filter(r => r.resource_type === 'Test' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
//       .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
//   }, [allResources]);

//   const resourcePerformanceItems = useMemo(() => {
//     const practices = practiceResources.slice(0, 4).map((r, i) => ({
//       label: `P${i + 1}`,
//       resource_name: r.resource_name,
//       resource_type: 'Practice',
//       resource_id: r.resource_id,
//       is_completed: r.is_completed,
//       updated_at: r.updated_at,
//       reattempts: 0,
//     }));
//     const tests = testResourcesList.slice(0, 4).map((r, i) => {
//       const entry = testReattempts.find(ra => ra.resource_id === r.resource_id);
//       return {
//         label: `T${i + 1}`,
//         resource_name: r.resource_name,
//         resource_type: 'Test',
//         resource_id: r.resource_id,
//         is_completed: r.is_completed,
//         updated_at: r.updated_at,
//         reattempts: entry ? Math.max(0, Number(entry.attempt_count) - 1) : 0,
//       };
//     });
//     return [...practices, ...tests];
//   }, [practiceResources, testResourcesList, testReattempts]);

//   const learningPathProgress = useMemo(() => {
//     const courseMap = {};
//     moduleCompletion.forEach(m => {
//       const key = m.course_name || 'Unknown Course';
//       if (!courseMap[key]) courseMap[key] = { course_name: key, modules: [] };
//       courseMap[key].modules.push(m);
//     });
//     return Object.values(courseMap);
//   }, [moduleCompletion]);

//   // ── Helpers ───────────────────────────────────────────────
//   const formatDateTime = (ds) => {
//     if (!ds || ds === 'N/A') return 'N/A';
//     const d = new Date(ds);
//     if (isNaN(d.getTime())) return 'N/A';
//     return d.toLocaleString('en-IN', {
//       year: 'numeric', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
//     });
//   };

//   const formatDate = (ds) => {
//     if (!ds || ds === 'N/A') return 'N/A';
//     const d = new Date(ds);
//     if (isNaN(d.getTime())) return 'N/A';
//     return d.toLocaleDateString('en-IN', {
//       year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata',
//     });
//   };

//   const calcAvgScore = (scores) => {
//     if (!scores) return null;
//     const vals = [
//       scores.plane_identification, scores.image_optimization,
//       scores.measurement, scores.diagnostic_interpretation,
//     ].map(Number).filter(v => !isNaN(v));
//     return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
//   };

//   // ── Sub-components ────────────────────────────────────────
//   const Spinner = ({ color = '#8DC63F', size = 5 }) => (
//     <div
//       className={`w-${size} h-${size} border-2 border-t-transparent rounded-full animate-spin`}
//       style={{ borderColor: `${color} transparent transparent transparent` }}
//     />
//   );

//   const StatCard = ({ icon: Icon, iconColor, label, completed: c, total: t }) => {
//     const pct = t > 0 ? Math.round((c / t) * 100) : 0;
//     return (
//       <div className="border shadow-sm rounded-lg p-3 bg-white flex flex-col gap-2">
//         <div className="flex justify-between items-center">
//           <div className="p-2 rounded-lg bg-gray-50">
//             <Icon size={20} className={iconColor} />
//           </div>
//           <div className="text-right">
//             <div className="text-xs text-gray-400">{label}</div>
//             {loading ? (
//               <div className="flex justify-end mt-1"><Spinner /></div>
//             ) : (
//               <div className="text-xl font-bold text-gray-700">
//                 {c}<span className="text-sm font-normal text-gray-400">/{t}</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="w-full bg-gray-100 rounded-full h-1.5">
//           <div className="h-1.5 rounded-full transition-all duration-500"
//             style={{ width: `${pct}%`, backgroundColor: '#8DC63F' }} />
//         </div>
//         <div className="text-[10px] text-gray-400">{pct}% completed</div>
//       </div>
//     );
//   };

//   const ScoreBadge = ({ label, value, color, subLabel }) => (
//     <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-gray-50 gap-1 min-h-[90px]">
//       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
//       {loading ? <Spinner size={4} /> : (
//         <div className="text-2xl font-bold" style={{ color }}>
//           {value !== null && value !== undefined ? value : '—'}
//         </div>
//       )}
//       {subLabel && <div className="text-[9px] text-gray-400 text-center leading-tight">{subLabel}</div>}
//     </div>
//   );

//   // ── NEW: Performance Metrics helpers ─────────────────────
//   const TrendIcon = ({ value, prev, lowerIsBetter = false }) => {
//     const improved = lowerIsBetter ? value < prev : value > prev;
//     const same = value === prev;
//     if (same) return <Minus size={12} className="text-gray-400" />;
//     return improved
//       ? <ChevronUp size={12} className="text-green-500" />
//       : <ChevronDown size={12} className="text-red-400" />;
//   };

//   const TrendLabel = ({ value, prev, unit = '', lowerIsBetter = false }) => {
//     const diff = Math.abs(value - prev);
//     const improved = lowerIsBetter ? value < prev : value > prev;
//     if (diff === 0) return <span className="text-[10px] text-gray-400">No change</span>;
//     return (
//       <span className={`text-[10px] font-semibold ${improved ? 'text-green-500' : 'text-red-400'}`}>
//         {improved ? '↑' : '↓'} {diff}{unit} from last
//       </span>
//     );
//   };

//   const skillLevelConfig = {
//     Beginner:     { color: '#ef4444', bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400' },
//     Intermediate: { color: '#f59e0b', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-400' },
//     Advanced:     { color: '#22c55e', bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
//   };

//   const consistencyConfig = {
//     Low:    { color: 'text-red-500',    bg: 'bg-red-50',    label: 'Low' },
//     Medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' },
//     High:   { color: 'text-green-600',  bg: 'bg-green-50',  label: 'High' },
//   };

//   // ── Render ────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
//         <NavBar />
//       </div>

//       <div className="flex flex-grow pt-12">
//         <div>
//           <SideBar handleButtonOpen={() => setButtonOpen(p => !p)} buttonOpen={buttonOpen} />
//         </div>

//         <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
//           <div className="p-4">
//             <div className="grid grid-cols-3 gap-5">

//               {/* ── LEFT + CENTRE COLUMN ────────────────────── */}
//               <div className="col-span-2 flex flex-col gap-4">
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="text-xl pt-1 font-semibold text-gray-700">
//                     Welcome Back, {individualTraineeProfile.data[0]?.user_name || 'NA'}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-4 gap-3">
//                   <StatCard icon={BookOpen}      iconColor="text-blue-500"   label="Learning Resources"   completed={completedLR}       total={totalLR} />
//                   <StatCard icon={Dumbbell}       iconColor="text-green-500"  label="Practices"             completed={completedPractice} total={totalPractice} />
//                   <StatCard icon={ClipboardCheck} iconColor="text-orange-500" label="Tests"                 completed={completedTests}    total={totalTests} />
//                   <StatCard icon={Eye}            iconColor="text-purple-500" label="Image Interpretations" completed={completedIR}       total={totalIR} />
//                 </div>

//                 {/* Last Score */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center justify-between gap-2 mb-4">
//                     <div className="flex items-center gap-1">
//                             <Award size={16} className="text-[#8DC63F]" />
//                             <div className="text-base font-semibold text-gray-700">Last Score</div>
//                     </div>
//                     <div className="flex items-center gap-2 mt-2">
//                         {/* Certificate Dropdown */}
//                         <select className="text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
//                             <option value="">Certificate</option>
//                             <option value="btc">BTC</option>
//                             <option value="svt">SVT</option>
//                         </select>

//                         {/* Course Dropdown */}
//                         <select className="text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
//                             <option value="">Course</option>
//                             <option value="1st">1st Trimester</option>
//                             <option value="2nd">2nd Trimester</option>
//                             <option value="3rd">3rd Trimester</option>
//                         </select>

//                         {/* Module Dropdown */}
//                         <select className="text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
//                             <option value="">Module</option>
//                             <option value="bpd-hc">BPD & HC</option>
//                             <option value="ac">AC</option>
//                             <option value="fl">FL</option>
//                         </select>
//                     </div>
//                     {testScores && (
//                       <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
//                         Last test: {formatDate(testScores.created_at)}
//                       </span>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-4 gap-3">
//                     <ScoreBadge
//                       label="MS"
//                       value={
//                         activityLastScores.loading
//                           ? null
//                           : msLastScoreSummary
//                           ? `${msLastScoreSummary.correct}/${msLastScoreSummary.totalQ}`
//                           : msTotalAttempts > 0 ? msTotalAttempts : '—'
//                       }
//                       color="#8DC63F"
//                       subLabel={
//                         msLastScoreSummary
//                           ? `MindSpark · ${msLastScoreSummary.resources} resource${msLastScoreSummary.resources > 1 ? 's' : ''} · ${msLastScoreSummary.wrong} wrong`
//                           : `MindSpark Attempts${msResourceCount > 0 ? ` (${msResourceCount} resources)` : ''}`
//                       }
//                     />
//                     <ScoreBadge
//                       label="OB"
//                       value={
//                         activityLastScores.loading
//                           ? null
//                           : obLastScoreSummary
//                           ? `${obLastScoreSummary.correct}/${obLastScoreSummary.totalQ}`
//                           : obResources.length > 0 ? `${obCompleted}/${obResources.length}` : '—'
//                       }
//                       color="#f97316"
//                       subLabel={
//                         obLastScoreSummary
//                           ? `OB Booster · ${obLastScoreSummary.resources} resource${obLastScoreSummary.resources > 1 ? 's' : ''} · ${obLastScoreSummary.wrong} wrong`
//                           : 'OB Booster'
//                       }
//                     />
//                     <ScoreBadge label="II" value={totalIR > 0 ? `${completedIR}/${totalIR}` : '—'} color="#a78bfa" subLabel="Image Interp." />
//                     <ScoreBadge label="T"  value={testScores ? `${calcAvgScore(testScores) ?? '—'}%` : '—'} color="#3b82f6" subLabel={testScores ? (testScores.resource_name || 'Last Test') : 'No test yet'} />
//                   </div>
//                   {testScores && (
//                     <div className="mt-4 pt-3 border-t border-gray-100">
//                       <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Last Test — Sub-Scores</div>
//                       <div className="grid grid-cols-2 gap-x-6 gap-y-2">
//                         {[
//                           { key: 'plane_identification',      label: 'Plane Identification', color: '#3b82f6' },
//                           { key: 'image_optimization',        label: 'Image Optimization',   color: '#8b5cf6' },
//                           { key: 'measurement',               label: 'Measurement',          color: '#10b981' },
//                           { key: 'diagnostic_interpretation', label: 'Diagnostic Interp.',   color: '#f59e0b' },
//                         ].map(({ key, label, color }) => {
//                           const val = Number(testScores[key]);
//                           const pct = isNaN(val) ? 0 : Math.min(100, Math.round(val));
//                           return (
//                             <div key={key} className="flex flex-col gap-1">
//                               <div className="flex justify-between text-[10px] text-gray-500">
//                                 <span>{label}</span>
//                                 <span className="font-semibold" style={{ color }}>{isNaN(val) ? '—' : `${val}%`}</span>
//                               </div>
//                               <div className="w-full bg-gray-100 rounded-full h-1.5">
//                                 <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Practice & Test Performance */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Target size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Practice &amp; Test Performance</div>
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-6"><Spinner /></div>
//                   ) : resourcePerformanceItems.length > 0 ? (
//                     <>
//                       <div className="overflow-x-auto">
//                         <table className="w-full text-sm border-collapse">
//                           <thead>
//                             <tr className="border-b border-gray-100 bg-gray-50">
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">#</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Resource</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Type</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Status</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Last Attempted</th>
//                               <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Re-Attempts</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {resourcePerformanceItems.map((item, idx) => (
//                               <tr key={item.resource_id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
//                                 <td className="py-2 px-2">
//                                   <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.resource_type === 'Practice' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
//                                     {item.label}
//                                   </span>
//                                 </td>
//                                 <td className="py-2 px-2 text-gray-700 font-medium max-w-[180px] truncate" title={item.resource_name}>{item.resource_name || 'N/A'}</td>
//                                 <td className="py-2 px-2">
//                                   <span className={`text-xs px-2 py-0.5 rounded-full ${item.resource_type === 'Practice' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
//                                     {item.resource_type}
//                                   </span>
//                                 </td>
//                                 <td className="py-2 px-2">
//                                   {item.is_completed ? (
//                                     <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={11} /> Done</span>
//                                   ) : item.updated_at ? (
//                                     <span className="text-xs text-orange-500">In Progress</span>
//                                   ) : (
//                                     <span className="text-xs text-gray-400">Not Started</span>
//                                   )}
//                                 </td>
//                                 <td className="py-2 px-2 text-xs text-gray-500">{item.updated_at ? formatDate(item.updated_at) : '—'}</td>
//                                 <td className="py-2 px-2">
//                                   {item.reattempts > 0 ? (
//                                     <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{item.reattempts}×</span>
//                                   ) : (
//                                     <span className="text-xs text-gray-300">—</span>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                       {testReattempts.length > 0 && (
//                         <div className="mt-4 pt-3 border-t border-gray-100">
//                           <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Overall — No. of Re-Attempts</div>
//                           <div className="flex flex-wrap gap-2">
//                             {testReattempts.map((r, i) => (
//                               <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 text-xs">
//                                 <span className="text-gray-600 font-medium truncate max-w-[140px]" title={r.resource_name}>{r.resource_name}</span>
//                                 <span className="text-orange-600 font-bold">{r.attempt_count}×</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-6">No practice or test data available yet</div>
//                   )}
//                 </div>

//                 {/* Queries */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <MessageSquare size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Queries Raised</div>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3">
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="text-sm text-gray-500">Total</div>
//                       <div className="text-2xl font-bold text-[#8DC63F]">{queries.loading ? <Spinner color="#8DC63F" /> : queries.total}</div>
//                     </div>
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="flex items-center gap-1.5">
//                         <AlertCircle size={14} className="text-orange-400" />
//                         <div className="text-sm text-gray-500">Pending</div>
//                       </div>
//                       <div className="text-2xl font-bold text-orange-500">{queries.loading ? <Spinner color="#f97316" /> : queries.pending}</div>
//                     </div>
//                     <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
//                       <div className="flex items-center gap-1.5">
//                         <CheckCircle size={14} className="text-green-500" />
//                         <div className="text-sm text-gray-500">Resolved</div>
//                       </div>
//                       <div className="text-2xl font-bold text-green-600">{queries.loading ? <Spinner color="#16a34a" /> : queries.resolved}</div>
//                     </div>
//                   </div>
//                   {queries.error && (
//                     <div className="mt-3 p-3 bg-red-50 text-red-600 rounded text-xs border border-red-200">Error loading queries: {queries.error}</div>
//                   )}
//                 </div>

//                 {/* LR Re-Attempts */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <IdentificationIcon size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">LR — Re-Attempts Interactions</div>
//                   </div>
//                   <InteractionDonut data={interactionStats.data} loading={interactionStats.loading} error={interactionStats.error} totalAttempts={totalAttempts} />
//                 </div>

//                 {/* Learning Path Progress */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <TrendingUp size={16} className="text-[#8DC63F]" />
//                     <div className="text-base font-semibold text-gray-700">Learning Path Progress</div>
//                     {moduleCompletion.length > 0 && (
//                       <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
//                         {moduleCompletion.filter(m => {
//                           const total = Number(m.total_learning_resources) + Number(m.total_image_interpretations);
//                           const done  = Number(m.completed_learning_resources) + Number(m.completed_image_interpretations);
//                           return total > 0 && done === total;
//                         }).length} / {moduleCompletion.length} modules done
//                       </span>
//                     )}
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-6"><Spinner /></div>
//                   ) : learningPathProgress.length > 0 ? (
//                     <div className="flex flex-col gap-5">
//                       {learningPathProgress.map((course, ci) => (
//                         <div key={ci}>
//                           <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2 pb-1 border-b border-gray-100">
//                             <BookOpen size={13} className="text-blue-400" />
//                             {course.course_name}
//                           </div>
//                           <div className="flex flex-col gap-2">
//                             {course.modules.map((mod, mi) => {
//                               const lrTotal = Number(mod.total_learning_resources)    || 0;
//                               const lrDone  = Number(mod.completed_learning_resources) || 0;
//                               const iiTotal = Number(mod.total_image_interpretations)  || 0;
//                               const iiDone  = Number(mod.completed_image_interpretations) || 0;
//                               const total   = lrTotal + iiTotal;
//                               const done    = lrDone  + iiDone;
//                               const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
//                               const isDone  = total > 0 && done === total;
//                               return (
//                                 <div key={mi} className={`rounded-lg border p-3 transition-colors ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
//                                   <div className="flex justify-between items-start mb-1.5">
//                                     <div className="flex flex-col gap-0.5">
//                                       <span className="text-xs font-semibold text-gray-700">{mod.unit_name || mod.module_name || 'Module'}</span>
//                                       {mod.unit_name && mod.module_name && (
//                                         <span className="text-[10px] text-gray-400">{mod.module_name}</span>
//                                       )}
//                                     </div>
//                                     <div className="flex items-center gap-1.5 ml-2 shrink-0">
//                                       {isDone && <CheckCircle size={12} className="text-green-500" />}
//                                       <span className={`text-xs font-bold ${isDone ? 'text-green-600' : 'text-gray-600'}`}>{pct}%</span>
//                                     </div>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                     <div className="h-1.5 rounded-full transition-all duration-700"
//                                       style={{ width: `${pct}%`, backgroundColor: isDone ? '#22c55e' : '#8DC63F' }} />
//                                   </div>
//                                   <div className="flex gap-4 mt-1.5 text-[10px] text-gray-400">
//                                     <span>LR: <span className="text-gray-600 font-medium">{lrDone}/{lrTotal}</span></span>
//                                     <span>II: <span className="text-gray-600 font-medium">{iiDone}/{iiTotal}</span></span>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-6">No learning path data available</div>
//                   )}
//                 </div>
//               </div>

//               {/* ── RIGHT PANEL ──────────────────────────────── */}
//               <div className="col-span-1 flex flex-col gap-4">

//                 {/* Associated Batch */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="text-gray-500 font-semibold mb-3">Associated Batch</div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : individualTraineeProfile.currentBatches[0] ? (
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Batch Name</div>
//                         <div className="font-semibold text-gray-700">{individualTraineeProfile.currentBatches[0]?.batch_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Valid Till</div>
//                         <div className="font-semibold text-gray-700">{formatDateTime(individualTraineeProfile.currentBatches[0]?.batch_end_date)}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Status</div>
//                         <div className="font-semibold">
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${individualTraineeProfile.currentBatches[0]?.batch_status === 'current' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                             {individualTraineeProfile.currentBatches[0]?.batch_status || 'N/A'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Instructors</div>
//                         <div className="font-semibold text-gray-700 text-xs">{individualTraineeProfile.currentBatches[0]?.instructors?.join(', ') || 'N/A'}</div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">No batch assigned</div>
//                   )}
//                 </div>

//                 {/* Overall Progress */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex justify-between items-center">
//                         <div className="text-gray-500 font-semibold mb-3">Overall Progress</div>
//                         <div className="mb-3">
//                             <select className="text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer">
//                                 <option value="">All Certificates</option>
//                                 <option value="btc">BTC</option>
//                                 <option value="svt">SVT</option>
//                             </select>
//                         </div>
//                   </div>
//                   <div className="flex justify-center items-center">
//                     <OverallCompletion data={{ totalResources, completed, attempted }} />
//                   </div>
//                   <div className="mt-3 grid grid-cols-2 gap-2 text-center">
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Total</div>
//                       <div className="text-lg font-bold text-gray-700">{totalResources}</div>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Completed</div>
//                       <div className="text-lg font-bold text-[#8DC63F]">{completed}</div>
//                     </div>
//                     {/* <div className="bg-blue-50 rounded-lg p-2">
//                       <div className="text-xs text-gray-400">Tests Done</div>
//                       <div className="text-lg font-bold text-blue-500">{attempted}</div>
//                     </div> */}
//                   </div>
//                 </div>

//                 {/* ══════════════════════════════════════════════
//                     NEW SECTION 1 — PERFORMANCE METRICS
//                     Replace MOCK_PERFORMANCE_METRICS with your API
//                     response shape when ready.
//                     ══════════════════════════════════════════════ */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Activity size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Performance Metrics</div>
//                     <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
//                       Mock Data
//                     </span>
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     {/* Accuracy */}
//                     <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-xs text-gray-500 font-medium">Accuracy</span>
//                         <div className="flex items-center gap-1">
//                           <TrendIcon value={MOCK_PERFORMANCE_METRICS.accuracy.value} prev={MOCK_PERFORMANCE_METRICS.accuracy.prev} />
//                           <span className="text-xl font-bold text-[#8DC63F]">
//                             {MOCK_PERFORMANCE_METRICS.accuracy.value}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div className="h-2 rounded-full transition-all duration-700 bg-[#8DC63F]"
//                           style={{ width: `${MOCK_PERFORMANCE_METRICS.accuracy.value}%` }} />
//                       </div>
//                       <TrendLabel
//                         value={MOCK_PERFORMANCE_METRICS.accuracy.value}
//                         prev={MOCK_PERFORMANCE_METRICS.accuracy.prev}
//                         unit="%"
//                       />
//                     </div>

//                     {/* Time per Task */}
//                     <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
//                       <div className="flex justify-between items-center mb-1">
//                         <div className="flex items-center gap-1.5">
//                           <Clock size={12} className="text-blue-400" />
//                           <span className="text-xs text-gray-500 font-medium">Time per Task</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <TrendIcon value={MOCK_PERFORMANCE_METRICS.timePerTask.value} prev={MOCK_PERFORMANCE_METRICS.timePerTask.prev} lowerIsBetter />
//                           <span className="text-xl font-bold text-blue-500">
//                             {MOCK_PERFORMANCE_METRICS.timePerTask.value} min
//                           </span>
//                         </div>
//                       </div>
//                       {/* Bar shows how close to 10 min cap (max) */}
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div className="h-2 rounded-full bg-blue-400 transition-all duration-700"
//                           style={{ width: `${Math.min(100, (MOCK_PERFORMANCE_METRICS.timePerTask.value / 10) * 100)}%` }} />
//                       </div>
//                       <TrendLabel
//                         value={MOCK_PERFORMANCE_METRICS.timePerTask.value}
//                         prev={MOCK_PERFORMANCE_METRICS.timePerTask.prev}
//                         unit=" min"
//                         lowerIsBetter
//                       />
//                     </div>

//                     {/* Error Rate */}
//                     <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-xs text-gray-500 font-medium">Error Rate</span>
//                         <div className="flex items-center gap-1">
//                           <TrendIcon value={MOCK_PERFORMANCE_METRICS.errorRate.value} prev={MOCK_PERFORMANCE_METRICS.errorRate.prev} lowerIsBetter />
//                           <span className="text-xl font-bold text-orange-500">
//                             {MOCK_PERFORMANCE_METRICS.errorRate.value}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div className="h-2 rounded-full bg-orange-400 transition-all duration-700"
//                           style={{ width: `${MOCK_PERFORMANCE_METRICS.errorRate.value}%` }} />
//                       </div>
//                       <TrendLabel
//                         value={MOCK_PERFORMANCE_METRICS.errorRate.value}
//                         prev={MOCK_PERFORMANCE_METRICS.errorRate.prev}
//                         unit="%"
//                         lowerIsBetter
//                       />
//                     </div>

//                     {/* Consistency */}
//                     <div className="flex justify-between items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
//                       <span className="text-xs text-gray-500 font-medium">Consistency</span>
//                       <span className={`text-xs font-bold px-3 py-1 rounded-full ${consistencyConfig[MOCK_PERFORMANCE_METRICS.consistency]?.bg} ${consistencyConfig[MOCK_PERFORMANCE_METRICS.consistency]?.color}`}>
//                         {MOCK_PERFORMANCE_METRICS.consistency}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ══════════════════════════════════════════════
//                     NEW SECTION 2 — SKILL COMPETENCY OVERVIEW
//                     Replace MOCK_SKILL_COMPETENCY with your API
//                     response shape when ready.
//                     ══════════════════════════════════════════════ */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Brain size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Skill Competency</div>
//                     <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
//                       Mock Data
//                     </span>
//                   </div>

//                   <div className="flex flex-col gap-2.5">
//                     {MOCK_SKILL_COMPETENCY.map((skill, i) => {
//                       const cfg = skillLevelConfig[skill.level] ?? skillLevelConfig['Intermediate'];
//                       return (
//                         <div key={i} className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
//                           <div className="flex justify-between items-center mb-1.5">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
//                               <span className="text-xs font-semibold text-gray-700">{skill.skill}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {/* Trend arrow */}
//                               {skill.trend === 'up' && <ChevronUp size={13} className="text-green-500" />}
//                               {skill.trend === 'down' && <ChevronDown size={13} className="text-red-400" />}
//                               {skill.trend === 'neutral' && <Minus size={13} className="text-gray-400" />}
//                               <span className="text-xs font-bold" style={{ color: cfg.color }}>{skill.score}%</span>
//                             </div>
//                           </div>
//                           {/* Score bar */}
//                           <div className="w-full bg-white rounded-full h-1.5 border border-gray-100">
//                             <div className="h-1.5 rounded-full transition-all duration-700"
//                               style={{ width: `${skill.score}%`, backgroundColor: cfg.color }} />
//                           </div>
//                           {/* Level badge */}
//                           <div className="mt-1.5">
//                             <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
//                               {skill.level}
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* ══════════════════════════════════════════════
//                     NEW SECTION 3 — LAST SESSION BREAKDOWN
//                     Replace MOCK_LAST_SESSION with your API
//                     response shape when ready.
//                     ══════════════════════════════════════════════ */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Zap size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Last Session</div>
//                     <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
//                       Mock Data
//                     </span>
//                   </div>

//                   {/* Module name + date */}
//                   <div className="text-xs text-gray-400 mb-3">{formatDateTime(MOCK_LAST_SESSION.date)}</div>
//                   <div className="text-sm font-semibold text-gray-700 mb-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
//                     {MOCK_LAST_SESSION.module}
//                   </div>

//                   {/* Checklist */}
//                   <div className="flex flex-col gap-2 mb-3">
//                     {MOCK_LAST_SESSION.checks.map((check, i) => (
//                       <div key={i} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium border ${
//                         check.passed
//                           ? 'bg-green-50 border-green-100 text-green-700'
//                           : 'bg-red-50 border-red-100 text-red-600'
//                       }`}>
//                         {check.passed
//                           ? <CheckCircle size={13} className="text-green-500 shrink-0" />
//                           : <XCircle    size={13} className="text-red-400 shrink-0" />
//                         }
//                         {check.label}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Instructor Feedback */}
//                   <div className="rounded-lg border border-[#8DC63F]/30 bg-[#8DC63F]/5 p-3">
//                     <div className="text-[10px] font-bold uppercase tracking-widest text-[#8DC63F] mb-1">
//                       💡 Feedback
//                     </div>
//                     <div className="text-xs text-gray-600 leading-relaxed italic">
//                       "{MOCK_LAST_SESSION.feedback}"
//                     </div>
//                   </div>

//                   {/* Action buttons */}
//                   <div className="grid grid-cols-2 gap-2 mt-3">
//                     <button className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors">
//                       Replay Attempt
//                     </button>
//                     <button className="text-xs font-semibold text-white rounded-lg py-2 hover:opacity-90 transition-opacity"
//                       style={{ backgroundColor: '#8DC63F' }}>
//                       Practice Again
//                     </button>
//                   </div>
//                 </div>

//                 {/* Last Completed Module */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-3">
//                     <CheckCircle size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Last Completed Module</div>
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : lastCompletedModuleData ? (
//                     <div className="flex flex-col gap-2">
//                       <div className="text-sm p-2 bg-green-50 rounded-lg border border-green-100">
//                         <div className="text-gray-400 text-xs mb-1">Unit</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.unit_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Module</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.module_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Course</div>
//                         <div className="font-semibold text-gray-700">{lastCompletedModuleData.course_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Last Activity</div>
//                         <div className="font-semibold text-gray-700">{formatDateTime(lastCompletedModuleData.lastDate)}</div>
//                       </div>
//                       <div className="flex flex-col gap-1 pt-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Resources Completed</span>
//                           <span className="font-semibold text-gray-500">{lastCompletedModuleData.completedCount}/{lastCompletedModuleData.totalCount}</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{
//                               width: `${lastCompletedModuleData.totalCount > 0 ? Math.round((lastCompletedModuleData.completedCount / lastCompletedModuleData.totalCount) * 100) : 0}%`,
//                               backgroundColor: '#8DC63F',
//                             }} />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">No module activity yet</div>
//                   )}
//                 </div>

//                 {/* Practice Streak */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Flame size={16} className="text-orange-500" />
//                     <div className="text-gray-500 font-semibold">Practice Streak</div>
//                     <div className="ml-auto flex items-center gap-1">
//                       <span className="text-2xl font-bold text-orange-500">{weeklyStreak}</span>
//                       <span className="text-xs text-gray-400 leading-tight">week{weeklyStreak !== 1 ? 's' : ''}</span>
//                     </div>
//                   </div>
//                   <div className="text-[10px] text-gray-400 mb-3">Weekly activity — last 8 weeks</div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : (
//                     <>
//                       <div className="flex items-end gap-1 h-14">
//                         {last8WeeksActivity.map((week, i) => {
//                           const maxCount = Math.max(...last8WeeksActivity.map(w => w.count), 1);
//                           const heightPct = week.count === 0 ? 15 : Math.max(20, Math.round((week.count / maxCount) * 100));
//                           return (
//                             <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
//                               <div
//                                 className={`w-full rounded-t transition-all duration-500 ${week.isCurrentWeek ? 'ring-1 ring-orange-400' : ''}`}
//                                 style={{
//                                   height: `${heightPct}%`,
//                                   backgroundColor: week.count === 0 ? '#e5e7eb' : week.count <= 3 ? '#bbf7d0' : week.count <= 7 ? '#8DC63F' : '#16a34a',
//                                 }}
//                                 title={`${week.week}: ${week.count} completion${week.count !== 1 ? 's' : ''}`}
//                               />
//                             </div>
//                           );
//                         })}
//                       </div>
//                       <div className="flex justify-between mt-1.5 text-[9px] text-gray-400 px-0.5">
//                         {last8WeeksActivity.map((week, i) => (
//                           <span key={i} className={`flex-1 text-center ${week.isCurrentWeek ? 'text-orange-500 font-semibold' : ''}`}>
//                             {week.week.split(' ')[0]}
//                           </span>
//                         ))}
//                       </div>
//                       {weeklyStreak === 0 && (
//                         <div className="mt-2 text-xs text-center text-gray-400 bg-gray-50 rounded-lg py-2">
//                           Complete a resource this week to start your streak!
//                         </div>
//                       )}
//                       {weeklyStreak >= 3 && (
//                         <div className="mt-2 text-xs text-center text-orange-500 font-semibold bg-orange-50 rounded-lg py-2">
//                           {weeklyStreak >= 8 ? 'Incredible streak!' : weeklyStreak >= 5 ? 'Great consistency!' : 'Keep it up!'}
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Next Module */}
//                 <div className="border rounded-lg p-5 border-gray-300 bg-white">
//                   <div className="flex items-center gap-2 mb-3">
//                     <ArrowRight size={16} className="text-[#8DC63F]" />
//                     <div className="text-gray-500 font-semibold">Next Module</div>
//                   </div>
//                   {loading ? (
//                     <div className="flex justify-center py-4"><Spinner /></div>
//                   ) : nextModule ? (
//                     <div className="flex flex-col gap-2">
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Unit</div>
//                         <div className="font-semibold text-gray-700">{nextModule.unit_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Module</div>
//                         <div className="font-semibold text-gray-700">{nextModule.module_name || 'N/A'}</div>
//                       </div>
//                       <div className="text-sm p-2 bg-gray-50 rounded-lg">
//                         <div className="text-gray-400 text-xs mb-1">Course</div>
//                         <div className="font-semibold text-gray-700">{nextModule.course_name || 'N/A'}</div>
//                       </div>
//                       <div className="flex flex-col gap-1 pt-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Learning Resources</span>
//                           <span>{nextModule.completed_learning_resources}/{nextModule.total_learning_resources}</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{ width: `${nextModuleLRPct}%`, backgroundColor: '#8DC63F' }} />
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <div className="flex justify-between text-[10px] text-gray-400">
//                           <span>Image Interpretations</span>
//                           <span>{nextModule.completed_image_interpretations}/{nextModule.total_image_interpretations}</span>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-1.5">
//                           <div className="h-1.5 rounded-full transition-all duration-500"
//                             style={{ width: `${nextModuleIRPct}%`, backgroundColor: '#a78bfa' }} />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-400 text-center py-4">All modules completed!</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default TraineeDashboard;

//new version let's see how it works
import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../navBar';
import SideBar from '../sideBar';
import { useNavigate, useParams } from 'react-router-dom';
import OverallCompletion from '../../charts/OverallCompletion';
import { GetQueriesAPI } from '../../API/GetQueriesAPI';
import {
  BookOpen, Dumbbell, Eye, ClipboardCheck, MessageSquare,
  CheckCircle, AlertCircle, BarChart, ArrowRight, Award,
  Target, Flame, TrendingUp, Activity, Zap, Brain,
  ChevronUp, ChevronDown, Minus, Clock, XCircle,
} from 'lucide-react';
import { IdentificationIcon } from 'hugeicons-react';
import TraineeProfileAPI from '../../API/TraineeProfileAPI';
import getInteractionsAttemptStats from '../../API/InteractionAttemptAPI';
import getActivityLastScores from '../../API/ActivityLastScoresAPI';
import InteractionDonut from '../../charts/InteractionDonut';
import {
  startOfWeek, endOfWeek, subWeeks, isWithinInterval, format,
} from 'date-fns';

// ─────────────────────────────────────────────────────────────
// MOCK DATA — swap these out for real API responses later
// ─────────────────────────────────────────────────────────────

const MOCK_PERFORMANCE_METRICS = {
  accuracy:    { value: 78, prev: 70, unit: '%' },
  timePerTask: { value: 4.2, prev: 5.1, unit: ' min' },
  errorRate:   { value: 18, prev: 24, unit: '%' },
  consistency: 'Medium',
};

const MOCK_SKILL_COMPETENCY = [
  { skill: 'Probe Handling',         level: 'Intermediate', score: 62, trend: 'up' },
  { skill: 'Plane Acquisition',      level: 'Advanced',     score: 84, trend: 'up' },
  { skill: 'Fetal Biometry',         level: 'Intermediate', score: 58, trend: 'neutral' },
  { skill: 'Anatomy Identification', level: 'Beginner',     score: 34, trend: 'down' },
];

const MOCK_LAST_SESSION = {
  module: 'Biometry — AC, P3',
  date: '2025-04-30T10:22:00',
  checks: [
    { label: 'Correct Plane Acquired',    passed: true },
    { label: 'Landmark Misidentified',    passed: false },
    { label: 'Measurement Offset +2.3mm', passed: false },
  ],
  feedback: 'Adjust probe tilt slightly inferiorly to get a cleaner abdominal circumference plane.',
};

// ─────────────────────────────────────────────────────────────

function TraineeDashboard() {
  const navigate   = useNavigate();
  const { people_id } = useParams();
  const [buttonOpen, setButtonOpen] = useState(true);

  // ── Trainee Profile ──────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [individualTraineeProfile, setIndividualTraineeProfile] = useState({
    data: [],
    instructors: [],
    currentBatches: [],
    completedBatches: [],
    certificates: [],
    testQuery: [],
    reAttempts: [],
    moduleCompletion: [],
    nextModule: null,
    latestProgress: null,
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
    pending: 0, resolved: 0, total: 0, loading: false, error: null,
  });

  const handleFetchQueries = async () => {
    try {
      setQueries(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem('user_token');
      const response = await GetQueriesAPI(token);
      const pendingCount  = response.result.filter(q => q.status === 'pending').length;
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
    data: [], loading: false, error: null,
  });

  const handleFetchInteractionStats = async () => {
    try {
      setInteractionStats(prev => ({ ...prev, loading: true }));
      const response = await getInteractionsAttemptStats();
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

  // ── Activity Last Scores ──────────────────────────────────
  const [activityLastScores, setActivityLastScores] = useState({
    data: [], loading: false, error: null,
  });

  const handleFetchActivityLastScores = async () => {
    try {
      setActivityLastScores(prev => ({ ...prev, loading: true }));
      const response = await getActivityLastScores();
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setActivityLastScores({ data, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching activity last scores:', error);
      setActivityLastScores(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => { handleFetchActivityLastScores(); }, []);

  // ── Base: all non-null resources ──────────────────────────
  const allResources = useMemo(
    () => (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null),
    [individualTraineeProfile.data]
  );

  // ── Certificate filter ────────────────────────────────────
  const [selectedCertificate, setSelectedCertificate] = useState('');

  /**
   * Build unique certificate list from raw data.
   * Each row has certificate_id + course_name; we use course_name as the
   * human-readable label (swap for a dedicated cert_name field if your API
   * returns one, e.g. "BTC", "SVT").
   */
  const certificates = useMemo(() => {
    const seen = new Set();
    return (individualTraineeProfile?.data ?? [])
      .filter(r => r.certificate_id)
      .reduce((acc, r) => {
        if (!seen.has(r.certificate_id)) {
          seen.add(r.certificate_id);
          acc.push({ id: r.certificate_id, label: r.course_name || r.certificate_id });
        }
        return acc;
      }, []);
  }, [individualTraineeProfile.data]);

  /**
   * filteredResources — the single source of truth for ALL stat cards,
   * progress charts, and counts. When selectedCertificate is '' (All),
   * this equals allResources; otherwise it narrows to just that cert.
   */
  const filteredResources = useMemo(
    () => selectedCertificate
      ? allResources.filter(r => r.certificate_id === selectedCertificate)
      : allResources,
    [allResources, selectedCertificate]
  );

  // ── Stat counts (all derived from filteredResources) ──────
  const totalLR       = useMemo(() => filteredResources.filter(r => r.resource_type === 'Learning Resource').length,                             [filteredResources]);
  const totalPractice = useMemo(() => filteredResources.filter(r => r.resource_type === 'Practice').length,                                      [filteredResources]);
  const totalTests    = useMemo(() => filteredResources.filter(r => r.resource_type === 'Test').length,                                          [filteredResources]);
  const totalIR       = useMemo(() => filteredResources.filter(r => r.resource_type === 'Image Interpretation').length,                          [filteredResources]);

  const completedLR       = useMemo(() => filteredResources.filter(r => r.resource_type === 'Learning Resource'    && r.is_completed === true).length, [filteredResources]);
  const completedPractice = useMemo(() => filteredResources.filter(r => r.resource_type === 'Practice'             && r.is_completed === true).length, [filteredResources]);
  const completedTests    = useMemo(() => filteredResources.filter(r => r.resource_type === 'Test'                 && r.is_completed === true).length, [filteredResources]);
  const completedIR       = useMemo(() => filteredResources.filter(r => r.resource_type === 'Image Interpretation' && r.is_completed === true).length, [filteredResources]);

  const totalResources = filteredResources.length;
  const completed      = useMemo(() => filteredResources.filter(r => r.is_completed === true).length, [filteredResources]);
  const attempted      = (individualTraineeProfile?.testQuery ?? []).length;
  const totalAttempts  = interactionStats.data.reduce((sum, r) => sum + Number(r.attempt_count), 0);

  // ── Next Module ───────────────────────────────────────────
  const nextModule = individualTraineeProfile?.nextModule ?? null;
  const nextModuleLRPct = nextModule
    ? Math.round((Number(nextModule.completed_learning_resources) / Number(nextModule.total_learning_resources)) * 100) || 0
    : 0;
  const nextModuleIRPct = nextModule
    ? Math.round((Number(nextModule.completed_image_interpretations) / Number(nextModule.total_image_interpretations)) * 100) || 0
    : 0;

  // ── Last Completed Module ─────────────────────────────────
  const lastCompletedModuleData = useMemo(() => {
    const moduleMap = {};
    filteredResources.forEach(r => {
      if (!r.learning_module_id) return;
      const key = r.learning_module_id;
      if (!moduleMap[key]) {
        moduleMap[key] = {
          learning_module_id: r.learning_module_id,
          unit_name: r.unit_name,
          module_name: r.module_name,
          course_name: r.course_name,
          resources: [],
        };
      }
      moduleMap[key].resources.push(r);
    });

    return Object.values(moduleMap)
      .map(m => {
        const completedRes = m.resources.filter(r => r.is_completed === true && r.updated_at);
        const totalCount   = m.resources.filter(r => r.resource_id).length;
        const lastDate     = completedRes.map(r => new Date(r.updated_at)).sort((a, b) => b - a)[0] ?? null;
        return { ...m, completedCount: completedRes.length, totalCount, lastDate };
      })
      .filter(m => m.completedCount > 0 && m.lastDate)
      .sort((a, b) => b.lastDate - a.lastDate)[0] ?? null;
  }, [filteredResources]);

  // ── Weekly Practice Streak ────────────────────────────────
  const weeklyStreak = useMemo(() => {
    const completedDates = filteredResources
      .filter(r => r.is_completed === true && r.updated_at)
      .map(r => new Date(r.updated_at));

    if (completedDates.length === 0) return 0;

    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd   = endOfWeek(now,   { weekStartsOn: 1 });
    const hasThisWeek   = completedDates.some(d => isWithinInterval(d, { start: thisWeekStart, end: thisWeekEnd }));

    let streak = 0;
    const startOffset = hasThisWeek ? 0 : 1;

    for (let i = startOffset; i < 52; i++) {
      const wStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
      if (completedDates.some(d => isWithinInterval(d, { start: wStart, end: wEnd }))) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [filteredResources]);

  // ── Last 8 Weeks Activity ─────────────────────────────────
  const last8WeeksActivity = useMemo(() => {
    const completedDates = filteredResources
      .filter(r => r.is_completed === true && r.updated_at)
      .map(r => new Date(r.updated_at));

    return Array.from({ length: 8 }, (_, i) => {
      const wStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
      const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
      const count  = completedDates.filter(d => isWithinInterval(d, { start: wStart, end: wEnd })).length;
      return { week: format(wStart, 'MMM d'), count, isCurrentWeek: i === 7 };
    });
  }, [filteredResources]);

  // ── Test Scores & Reattempts ──────────────────────────────
  const testScores     = (individualTraineeProfile?.testQuery ?? [])[0] ?? null;
  const testReattempts = useMemo(() => individualTraineeProfile?.reAttempts ?? [], [individualTraineeProfile.reAttempts]);
  const moduleCompletion = useMemo(() => individualTraineeProfile?.moduleCompletion ?? [], [individualTraineeProfile.moduleCompletion]);

  const msResourceCount = interactionStats.data.length;

  // ── OB Booster detection ──────────────────────────────────
  const isOBRecord = (r) => {
    const rto = (r.resource_topic || '').toLowerCase();
    const rn  = (r.resource_name  || '').toLowerCase();
    const rt  = (r.resource_type  || '').toLowerCase();
    return rto.includes('ob booster') || rto.includes('ob boosters') ||
           rn.includes('ob booster')  || rn.includes('ob boosters')  ||
           rt.includes('ob booster')  || rt.includes('ob boosters');
  };

  const obResources = useMemo(() =>
    filteredResources.filter(r =>
      r.resource_topic?.toLowerCase().includes('ob booster') ||
      r.resource_name?.toLowerCase().includes('ob booster') ||
      r.resource_topic?.toLowerCase().includes('ob boosters')
    ), [filteredResources]);
  const obCompleted = obResources.filter(r => r.is_completed === true).length;

  const msLastScores = useMemo(() =>
    activityLastScores.data.filter(r => !isOBRecord(r)),
  [activityLastScores.data]);

  const msLastScoreSummary = useMemo(() => {
    if (!msLastScores.length) return null;
    const totalQ  = msLastScores.reduce((s, r) => s + Number(r.total_questions || 0), 0);
    const correct = msLastScores.reduce((s, r) => s + Number(r.correct_answers || 0), 0);
    const wrong   = msLastScores.reduce((s, r) => s + Number(r.wrong_answers   || 0), 0);
    return { totalQ, correct, wrong, resources: msLastScores.length };
  }, [msLastScores]);

  const obLastScores = useMemo(() =>
    activityLastScores.data.filter(r => isOBRecord(r)),
  [activityLastScores.data]);

  const obLastScoreSummary = useMemo(() => {
    if (!obLastScores.length) return null;
    const totalQ  = obLastScores.reduce((s, r) => s + Number(r.total_questions || 0), 0);
    const correct = obLastScores.reduce((s, r) => s + Number(r.correct_answers || 0), 0);
    const wrong   = obLastScores.reduce((s, r) => s + Number(r.wrong_answers   || 0), 0);
    return { totalQ, correct, wrong, resources: obLastScores.length };
  }, [obLastScores]);

  // ── Practice & Test resource lists ───────────────────────
  const practiceResources = useMemo(() => {
    const seen = new Set();
    return filteredResources
      .filter(r => r.resource_type === 'Practice' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
      .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
  }, [filteredResources]);

  const testResourcesList = useMemo(() => {
    const seen = new Set();
    return filteredResources
      .filter(r => r.resource_type === 'Test' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
      .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
  }, [filteredResources]);

  const resourcePerformanceItems = useMemo(() => {
    const practices = practiceResources.slice(0, 4).map((r, i) => ({
      label: `P${i + 1}`,
      resource_name: r.resource_name,
      resource_type: 'Practice',
      resource_id: r.resource_id,
      is_completed: r.is_completed,
      updated_at: r.updated_at,
      reattempts: 0,
    }));
    const tests = testResourcesList.slice(0, 4).map((r, i) => {
      const entry = testReattempts.find(ra => ra.resource_id === r.resource_id);
      return {
        label: `T${i + 1}`,
        resource_name: r.resource_name,
        resource_type: 'Test',
        resource_id: r.resource_id,
        is_completed: r.is_completed,
        updated_at: r.updated_at,
        reattempts: entry ? Math.max(0, Number(entry.attempt_count) - 1) : 0,
      };
    });
    return [...practices, ...tests];
  }, [practiceResources, testResourcesList, testReattempts]);

  // ── Learning path filtered by certificate ────────────────
  const learningPathProgress = useMemo(() => {
    // Filter moduleCompletion to only modules present in filteredResources
    const visibleModuleIds = new Set(filteredResources.map(r => r.learning_module_id));
    const filtered = selectedCertificate
      ? moduleCompletion.filter(m => visibleModuleIds.has(m.learning_module_id))
      : moduleCompletion;

    const courseMap = {};
    filtered.forEach(m => {
      const key = m.course_name || 'Unknown Course';
      if (!courseMap[key]) courseMap[key] = { course_name: key, modules: [] };
      courseMap[key].modules.push(m);
    });
    return Object.values(courseMap);
  }, [moduleCompletion, filteredResources, selectedCertificate]);

  // ── Helpers ───────────────────────────────────────────────
  const formatDateTime = (ds) => {
    if (!ds || ds === 'N/A') return 'N/A';
    const d = new Date(ds);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
    });
  };

  const formatDate = (ds) => {
    if (!ds || ds === 'N/A') return 'N/A';
    const d = new Date(ds);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata',
    });
  };

  const calcAvgScore = (scores) => {
    if (!scores) return null;
    const vals = [
      scores.plane_identification, scores.image_optimization,
      scores.measurement, scores.diagnostic_interpretation,
    ].map(Number).filter(v => !isNaN(v));
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };

  // ── Sub-components ────────────────────────────────────────
  const Spinner = ({ color = '#8DC63F', size = 5 }) => (
    <div
      className={`w-${size} h-${size} border-2 border-t-transparent rounded-full animate-spin`}
      style={{ borderColor: `${color} transparent transparent transparent` }}
    />
  );

  const StatCard = ({ icon: Icon, iconColor, label, completed: c, total: t }) => {
    const pct = t > 0 ? Math.round((c / t) * 100) : 0;
    return (
      <div className="border shadow-sm rounded-lg p-3 bg-white flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon size={20} className={iconColor} />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">{label}</div>
            {loading ? (
              <div className="flex justify-end mt-1"><Spinner /></div>
            ) : (
              <div className="text-xl font-bold text-gray-700">
                {c}<span className="text-sm font-normal text-gray-400">/{t}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: '#8DC63F' }} />
        </div>
        <div className="text-[10px] text-gray-400">{pct}% completed</div>
      </div>
    );
  };

  const ScoreBadge = ({ label, value, color, subLabel }) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-gray-50 gap-1 min-h-[90px]">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
      {loading ? <Spinner size={4} /> : (
        <div className="text-2xl font-bold" style={{ color }}>
          {value !== null && value !== undefined ? value : '—'}
        </div>
      )}
      {subLabel && <div className="text-[9px] text-gray-400 text-center leading-tight">{subLabel}</div>}
    </div>
  );

  // ── Performance Metrics helpers ───────────────────────────
  const TrendIcon = ({ value, prev, lowerIsBetter = false }) => {
    const improved = lowerIsBetter ? value < prev : value > prev;
    const same = value === prev;
    if (same) return <Minus size={12} className="text-gray-400" />;
    return improved
      ? <ChevronUp size={12} className="text-green-500" />
      : <ChevronDown size={12} className="text-red-400" />;
  };

  const TrendLabel = ({ value, prev, unit = '', lowerIsBetter = false }) => {
    const diff = Math.abs(value - prev);
    const improved = lowerIsBetter ? value < prev : value > prev;
    if (diff === 0) return <span className="text-[10px] text-gray-400">No change</span>;
    return (
      <span className={`text-[10px] font-semibold ${improved ? 'text-green-500' : 'text-red-400'}`}>
        {improved ? '↑' : '↓'} {diff}{unit} from last
      </span>
    );
  };

  const skillLevelConfig = {
    Beginner:     { color: '#ef4444', bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400' },
    Intermediate: { color: '#f59e0b', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-400' },
    Advanced:     { color: '#22c55e', bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  };

  const consistencyConfig = {
    Low:    { color: 'text-red-500',    bg: 'bg-red-50',    label: 'Low' },
    Medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' },
    High:   { color: 'text-green-600',  bg: 'bg-green-50',  label: 'High' },
  };

  // ── Shared dropdown style ─────────────────────────────────
  const selectCls = "text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#8DC63F] focus:border-[#8DC63F] cursor-pointer";

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

              {/* ── LEFT + CENTRE COLUMN ────────────────────── */}
              <div className="col-span-2 flex flex-col gap-4">

                {/* Welcome */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-xl pt-1 font-semibold text-gray-700">
                    Welcome Back, {individualTraineeProfile.data[0]?.user_name || 'NA'}
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <StatCard icon={BookOpen}      iconColor="text-blue-500"   label="Learning Resources"   completed={completedLR}       total={totalLR} />
                  <StatCard icon={Dumbbell}       iconColor="text-green-500"  label="Practices"             completed={completedPractice} total={totalPractice} />
                  <StatCard icon={ClipboardCheck} iconColor="text-orange-500" label="Tests"                 completed={completedTests}    total={totalTests} />
                  <StatCard icon={Eye}            iconColor="text-purple-500" label="Image Interpretations" completed={completedIR}       total={totalIR} />
                </div>

                {/* Last Score */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Award size={16} className="text-[#8DC63F]" />
                      <div className="text-base font-semibold text-gray-700">Last Score</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <select className={selectCls}>
                        <option value="">Certificate</option>
                        <option value="btc">BTC</option>
                        <option value="svt">SVT</option>
                      </select>
                      <select className={selectCls}>
                        <option value="">Course</option>
                        <option value="1st">1st Trimester</option>
                        <option value="2nd">2nd Trimester</option>
                        <option value="3rd">3rd Trimester</option>
                      </select>
                      <select className={selectCls}>
                        <option value="">Module</option>
                        <option value="bpd-hc">BPD &amp; HC</option>
                        <option value="ac">AC</option>
                        <option value="fl">FL</option>
                      </select>
                    </div>
                    {testScores && (
                      <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        Last test: {formatDate(testScores.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <ScoreBadge
                      label="MS"
                      value={
                        activityLastScores.loading
                          ? null
                          : msLastScoreSummary
                          ? `${msLastScoreSummary.correct}/${msLastScoreSummary.totalQ}`
                          : totalAttempts > 0 ? totalAttempts : '—'
                      }
                      color="#8DC63F"
                      subLabel={
                        msLastScoreSummary
                          ? `MindSpark · ${msLastScoreSummary.resources} resource${msLastScoreSummary.resources > 1 ? 's' : ''} · ${msLastScoreSummary.wrong} wrong`
                          : `MindSpark Attempts${msResourceCount > 0 ? ` (${msResourceCount} resources)` : ''}`
                      }
                    />
                    <ScoreBadge
                      label="OB"
                      value={
                        activityLastScores.loading
                          ? null
                          : obLastScoreSummary
                          ? `${obLastScoreSummary.correct}/${obLastScoreSummary.totalQ}`
                          : obResources.length > 0 ? `${obCompleted}/${obResources.length}` : '—'
                      }
                      color="#f97316"
                      subLabel={
                        obLastScoreSummary
                          ? `OB Booster · ${obLastScoreSummary.resources} resource${obLastScoreSummary.resources > 1 ? 's' : ''} · ${obLastScoreSummary.wrong} wrong`
                          : 'OB Booster'
                      }
                    />
                    <ScoreBadge label="II" value={totalIR > 0 ? `${completedIR}/${totalIR}` : '—'} color="#a78bfa" subLabel="Image Interp." />
                    <ScoreBadge label="T"  value={testScores ? `${calcAvgScore(testScores) ?? '—'}%` : '—'} color="#3b82f6" subLabel={testScores ? (testScores.resource_name || 'Last Test') : 'No test yet'} />
                  </div>
                  {testScores && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Last Test — Sub-Scores</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {[
                          { key: 'plane_identification',      label: 'Plane Identification', color: '#3b82f6' },
                          { key: 'image_optimization',        label: 'Image Optimization',   color: '#8b5cf6' },
                          { key: 'measurement',               label: 'Measurement',          color: '#10b981' },
                          { key: 'diagnostic_interpretation', label: 'Diagnostic Interp.',   color: '#f59e0b' },
                        ].map(({ key, label, color }) => {
                          const val = Number(testScores[key]);
                          const pct = isNaN(val) ? 0 : Math.min(100, Math.round(val));
                          return (
                            <div key={key} className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] text-gray-500">
                                <span>{label}</span>
                                <span className="font-semibold" style={{ color }}>{isNaN(val) ? '—' : `${val}%`}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Practice & Test Performance */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">Practice &amp; Test Performance</div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-6"><Spinner /></div>
                  ) : resourcePerformanceItems.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">#</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Resource</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Type</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Status</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Last Attempted</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Re-Attempts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resourcePerformanceItems.map((item, idx) => (
                              <tr key={item.resource_id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-2 px-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.resource_type === 'Practice' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {item.label}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-gray-700 font-medium max-w-[180px] truncate" title={item.resource_name}>{item.resource_name || 'N/A'}</td>
                                <td className="py-2 px-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.resource_type === 'Practice' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {item.resource_type}
                                  </span>
                                </td>
                                <td className="py-2 px-2">
                                  {item.is_completed ? (
                                    <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={11} /> Done</span>
                                  ) : item.updated_at ? (
                                    <span className="text-xs text-orange-500">In Progress</span>
                                  ) : (
                                    <span className="text-xs text-gray-400">Not Started</span>
                                  )}
                                </td>
                                <td className="py-2 px-2 text-xs text-gray-500">{item.updated_at ? formatDate(item.updated_at) : '—'}</td>
                                <td className="py-2 px-2">
                                  {item.reattempts > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{item.reattempts}×</span>
                                  ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {testReattempts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Overall — No. of Re-Attempts</div>
                          <div className="flex flex-wrap gap-2">
                            {testReattempts.map((r, i) => (
                              <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 text-xs">
                                <span className="text-gray-600 font-medium truncate max-w-[140px]" title={r.resource_name}>{r.resource_name}</span>
                                <span className="text-orange-600 font-bold">{r.attempt_count}×</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-6">No practice or test data available yet</div>
                  )}
                </div>

                {/* Queries */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">Queries Raised</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold text-[#8DC63F]">{queries.loading ? <Spinner color="#8DC63F" /> : queries.total}</div>
                    </div>
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-orange-400" />
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                      <div className="text-2xl font-bold text-orange-500">{queries.loading ? <Spinner color="#f97316" /> : queries.pending}</div>
                    </div>
                    <div className="border shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-green-500" />
                        <div className="text-sm text-gray-500">Resolved</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{queries.loading ? <Spinner color="#16a34a" /> : queries.resolved}</div>
                    </div>
                  </div>
                  {queries.error && (
                    <div className="mt-3 p-3 bg-red-50 text-red-600 rounded text-xs border border-red-200">Error loading queries: {queries.error}</div>
                  )}
                </div>

                {/* LR Re-Attempts */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <IdentificationIcon size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">LR — Re-Attempts Interactions</div>
                  </div>
                  <InteractionDonut data={interactionStats.data} loading={interactionStats.loading} error={interactionStats.error} totalAttempts={totalAttempts} />
                </div>

                {/* Learning Path Progress */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">Learning Path Progress</div>
                    {moduleCompletion.length > 0 && (
                      <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {moduleCompletion.filter(m => {
                          const total = Number(m.total_learning_resources) + Number(m.total_image_interpretations);
                          const done  = Number(m.completed_learning_resources) + Number(m.completed_image_interpretations);
                          return total > 0 && done === total;
                        }).length} / {moduleCompletion.length} modules done
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-6"><Spinner /></div>
                  ) : learningPathProgress.length > 0 ? (
                    <div className="flex flex-col gap-5">
                      {learningPathProgress.map((course, ci) => (
                        <div key={ci}>
                          <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2 pb-1 border-b border-gray-100">
                            <BookOpen size={13} className="text-blue-400" />
                            {course.course_name}
                          </div>
                          <div className="flex flex-col gap-2">
                            {course.modules.map((mod, mi) => {
                              const lrTotal = Number(mod.total_learning_resources)       || 0;
                              const lrDone  = Number(mod.completed_learning_resources)   || 0;
                              const iiTotal = Number(mod.total_image_interpretations)    || 0;
                              const iiDone  = Number(mod.completed_image_interpretations) || 0;
                              const total   = lrTotal + iiTotal;
                              const done    = lrDone  + iiDone;
                              const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
                              const isDone  = total > 0 && done === total;
                              return (
                                <div key={mi} className={`rounded-lg border p-3 transition-colors ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                  <div className="flex justify-between items-start mb-1.5">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-semibold text-gray-700">{mod.unit_name || mod.module_name || 'Module'}</span>
                                      {mod.unit_name && mod.module_name && (
                                        <span className="text-[10px] text-gray-400">{mod.module_name}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                      {isDone && <CheckCircle size={12} className="text-green-500" />}
                                      <span className={`text-xs font-bold ${isDone ? 'text-green-600' : 'text-gray-600'}`}>{pct}%</span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full transition-all duration-700"
                                      style={{ width: `${pct}%`, backgroundColor: isDone ? '#22c55e' : '#8DC63F' }} />
                                  </div>
                                  <div className="flex gap-4 mt-1.5 text-[10px] text-gray-400">
                                    <span>LR: <span className="text-gray-600 font-medium">{lrDone}/{lrTotal}</span></span>
                                    <span>II: <span className="text-gray-600 font-medium">{iiDone}/{iiTotal}</span></span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-6">No learning path data available</div>
                  )}
                </div>
              </div>

              {/* ── RIGHT PANEL ──────────────────────────────── */}
              <div className="col-span-1 flex flex-col gap-4">

                {/* Associated Batch */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-gray-500 font-semibold mb-3">Associated Batch</div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : individualTraineeProfile.currentBatches[0] ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Batch Name</div>
                        <div className="font-semibold text-gray-700">{individualTraineeProfile.currentBatches[0]?.batch_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Valid Till</div>
                        <div className="font-semibold text-gray-700">{formatDateTime(individualTraineeProfile.currentBatches[0]?.batch_end_date)}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Status</div>
                        <div className="font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${individualTraineeProfile.currentBatches[0]?.batch_status === 'current' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {individualTraineeProfile.currentBatches[0]?.batch_status || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Instructors</div>
                        <div className="font-semibold text-gray-700 text-xs">{individualTraineeProfile.currentBatches[0]?.instructors?.join(', ') || 'N/A'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">No batch assigned</div>
                  )}
                </div>

                {/* ══════════════════════════════════════════════
                    OVERALL PROGRESS — certificate-aware
                    Dropdown is built from real API data.
                    Selecting a cert filters ALL counts above too.
                    ══════════════════════════════════════════════ */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-gray-500 font-semibold">Overall Progress</div>
                    <select
                      value={selectedCertificate}
                      onChange={e => setSelectedCertificate(e.target.value)}
                      className={selectCls}
                    >
                      <option value="">All Certificates</option>
                      {certificates.map(cert => (
                        <option key={cert.id} value={cert.id}>
                          {cert.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-center items-center">
                    <OverallCompletion data={{ totalResources, completed, attempted }} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-lg font-bold text-gray-700">{totalResources}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Completed</div>
                      <div className="text-lg font-bold text-[#8DC63F]">{completed}</div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics (Mock) */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-[#8DC63F]" />
                    <div className="text-gray-500 font-semibold">Performance Metrics</div>
                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                      Mock Data
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Accuracy */}
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 font-medium">Accuracy</span>
                        <div className="flex items-center gap-1">
                          <TrendIcon value={MOCK_PERFORMANCE_METRICS.accuracy.value} prev={MOCK_PERFORMANCE_METRICS.accuracy.prev} />
                          <span className="text-xl font-bold text-[#8DC63F]">{MOCK_PERFORMANCE_METRICS.accuracy.value}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-700 bg-[#8DC63F]"
                          style={{ width: `${MOCK_PERFORMANCE_METRICS.accuracy.value}%` }} />
                      </div>
                      <TrendLabel value={MOCK_PERFORMANCE_METRICS.accuracy.value} prev={MOCK_PERFORMANCE_METRICS.accuracy.prev} unit="%" />
                    </div>
                    {/* Time per Task */}
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-blue-400" />
                          <span className="text-xs text-gray-500 font-medium">Time per Task</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendIcon value={MOCK_PERFORMANCE_METRICS.timePerTask.value} prev={MOCK_PERFORMANCE_METRICS.timePerTask.prev} lowerIsBetter />
                          <span className="text-xl font-bold text-blue-500">{MOCK_PERFORMANCE_METRICS.timePerTask.value} min</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-400 transition-all duration-700"
                          style={{ width: `${Math.min(100, (MOCK_PERFORMANCE_METRICS.timePerTask.value / 10) * 100)}%` }} />
                      </div>
                      <TrendLabel value={MOCK_PERFORMANCE_METRICS.timePerTask.value} prev={MOCK_PERFORMANCE_METRICS.timePerTask.prev} unit=" min" lowerIsBetter />
                    </div>
                    {/* Error Rate */}
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 font-medium">Error Rate</span>
                        <div className="flex items-center gap-1">
                          <TrendIcon value={MOCK_PERFORMANCE_METRICS.errorRate.value} prev={MOCK_PERFORMANCE_METRICS.errorRate.prev} lowerIsBetter />
                          <span className="text-xl font-bold text-orange-500">{MOCK_PERFORMANCE_METRICS.errorRate.value}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-400 transition-all duration-700"
                          style={{ width: `${MOCK_PERFORMANCE_METRICS.errorRate.value}%` }} />
                      </div>
                      <TrendLabel value={MOCK_PERFORMANCE_METRICS.errorRate.value} prev={MOCK_PERFORMANCE_METRICS.errorRate.prev} unit="%" lowerIsBetter />
                    </div>
                    {/* Consistency */}
                    <div className="flex justify-between items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <span className="text-xs text-gray-500 font-medium">Consistency</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${consistencyConfig[MOCK_PERFORMANCE_METRICS.consistency]?.bg} ${consistencyConfig[MOCK_PERFORMANCE_METRICS.consistency]?.color}`}>
                        {MOCK_PERFORMANCE_METRICS.consistency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill Competency (Mock) */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={16} className="text-[#8DC63F]" />
                    <div className="text-gray-500 font-semibold">Skill Competency</div>
                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                      Mock Data
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {MOCK_SKILL_COMPETENCY.map((skill, i) => {
                      const cfg = skillLevelConfig[skill.level] ?? skillLevelConfig['Intermediate'];
                      return (
                        <div key={i} className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                              <span className="text-xs font-semibold text-gray-700">{skill.skill}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {skill.trend === 'up'      && <ChevronUp   size={13} className="text-green-500" />}
                              {skill.trend === 'down'    && <ChevronDown size={13} className="text-red-400" />}
                              {skill.trend === 'neutral' && <Minus       size={13} className="text-gray-400" />}
                              <span className="text-xs font-bold" style={{ color: cfg.color }}>{skill.score}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-white rounded-full h-1.5 border border-gray-100">
                            <div className="h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${skill.score}%`, backgroundColor: cfg.color }} />
                          </div>
                          <div className="mt-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                              {skill.level}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Last Session (Mock) */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-[#8DC63F]" />
                    <div className="text-gray-500 font-semibold">Last Session</div>
                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                      Mock Data
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">{formatDateTime(MOCK_LAST_SESSION.date)}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {MOCK_LAST_SESSION.module}
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    {MOCK_LAST_SESSION.checks.map((check, i) => (
                      <div key={i} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium border ${
                        check.passed ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'
                      }`}>
                        {check.passed
                          ? <CheckCircle size={13} className="text-green-500 shrink-0" />
                          : <XCircle    size={13} className="text-red-400 shrink-0" />
                        }
                        {check.label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-[#8DC63F]/30 bg-[#8DC63F]/5 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#8DC63F] mb-1">💡 Feedback</div>
                    <div className="text-xs text-gray-600 leading-relaxed italic">
                      "{MOCK_LAST_SESSION.feedback}"
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors">
                      Replay Attempt
                    </button>
                    <button className="text-xs font-semibold text-white rounded-lg py-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#8DC63F' }}>
                      Practice Again
                    </button>
                  </div>
                </div>

                {/* Last Completed Module */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-[#8DC63F]" />
                    <div className="text-gray-500 font-semibold">Last Completed Module</div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : lastCompletedModuleData ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-sm p-2 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-gray-400 text-xs mb-1">Unit</div>
                        <div className="font-semibold text-gray-700">{lastCompletedModuleData.unit_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Module</div>
                        <div className="font-semibold text-gray-700">{lastCompletedModuleData.module_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Course</div>
                        <div className="font-semibold text-gray-700">{lastCompletedModuleData.course_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Last Activity</div>
                        <div className="font-semibold text-gray-700">{formatDateTime(lastCompletedModuleData.lastDate)}</div>
                      </div>
                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Resources Completed</span>
                          <span className="font-semibold text-gray-500">{lastCompletedModuleData.completedCount}/{lastCompletedModuleData.totalCount}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${lastCompletedModuleData.totalCount > 0 ? Math.round((lastCompletedModuleData.completedCount / lastCompletedModuleData.totalCount) * 100) : 0}%`,
                              backgroundColor: '#8DC63F',
                            }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">No module activity yet</div>
                  )}
                </div>

                {/* Practice Streak */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame size={16} className="text-orange-500" />
                    <div className="text-gray-500 font-semibold">Practice Streak</div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-2xl font-bold text-orange-500">{weeklyStreak}</span>
                      <span className="text-xs text-gray-400 leading-tight">week{weeklyStreak !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-3">Weekly activity — last 8 weeks</div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1 h-14">
                        {last8WeeksActivity.map((week, i) => {
                          const maxCount  = Math.max(...last8WeeksActivity.map(w => w.count), 1);
                          const heightPct = week.count === 0 ? 15 : Math.max(20, Math.round((week.count / maxCount) * 100));
                          return (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                              <div
                                className={`w-full rounded-t transition-all duration-500 ${week.isCurrentWeek ? 'ring-1 ring-orange-400' : ''}`}
                                style={{
                                  height: `${heightPct}%`,
                                  backgroundColor: week.count === 0 ? '#e5e7eb' : week.count <= 3 ? '#bbf7d0' : week.count <= 7 ? '#8DC63F' : '#16a34a',
                                }}
                                title={`${week.week}: ${week.count} completion${week.count !== 1 ? 's' : ''}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1.5 text-[9px] text-gray-400 px-0.5">
                        {last8WeeksActivity.map((week, i) => (
                          <span key={i} className={`flex-1 text-center ${week.isCurrentWeek ? 'text-orange-500 font-semibold' : ''}`}>
                            {week.week.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                      {weeklyStreak === 0 && (
                        <div className="mt-2 text-xs text-center text-gray-400 bg-gray-50 rounded-lg py-2">
                          Complete a resource this week to start your streak!
                        </div>
                      )}
                      {weeklyStreak >= 3 && (
                        <div className="mt-2 text-xs text-center text-orange-500 font-semibold bg-orange-50 rounded-lg py-2">
                          {weeklyStreak >= 8 ? 'Incredible streak!' : weeklyStreak >= 5 ? 'Great consistency!' : 'Keep it up!'}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Next Module */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight size={16} className="text-[#8DC63F]" />
                    <div className="text-gray-500 font-semibold">Next Module</div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : nextModule ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Unit</div>
                        <div className="font-semibold text-gray-700">{nextModule.unit_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Module</div>
                        <div className="font-semibold text-gray-700">{nextModule.module_name || 'N/A'}</div>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-xs mb-1">Course</div>
                        <div className="font-semibold text-gray-700">{nextModule.course_name || 'N/A'}</div>
                      </div>
                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Learning Resources</span>
                          <span>{nextModule.completed_learning_resources}/{nextModule.total_learning_resources}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${nextModuleLRPct}%`, backgroundColor: '#8DC63F' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Image Interpretations</span>
                          <span>{nextModule.completed_image_interpretations}/{nextModule.total_image_interpretations}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${nextModuleIRPct}%`, backgroundColor: '#a78bfa' }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">All modules completed!</div>
                  )}
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