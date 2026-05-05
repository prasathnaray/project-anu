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

import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../navBar';
import SideBar from '../sideBar';
import { useNavigate, useParams } from 'react-router-dom';
import OverallCompletion from '../../charts/OverallCompletion';
import { GetQueriesAPI } from '../../API/GetQueriesAPI';
import {
  BookOpen, Dumbbell, Eye, ClipboardCheck, MessageSquare,
  CheckCircle, AlertCircle, BarChart, ArrowRight, Award,
  Target, Flame, TrendingUp,
} from 'lucide-react';
import { IdentificationIcon } from 'hugeicons-react';
import TraineeProfileAPI from '../../API/TraineeProfileAPI';
import getInteractionsAttemptStats from '../../API/InteractionAttemptAPI';
import InteractionDonut from '../../charts/InteractionDonut';
import {
  startOfWeek, endOfWeek, subWeeks, isWithinInterval, format,
} from 'date-fns';

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

  // ── Derived values ────────────────────────────────────────
  const allResources = useMemo(
    () => (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null),
    [individualTraineeProfile.data]
  );

  const totalLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource').length, [allResources]);
  const totalPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice').length, [allResources]);
  const totalTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test').length, [allResources]);
  const totalIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation').length, [allResources]);

  const completedLR       = useMemo(() => allResources.filter(r => r.resource_type === 'Learning Resource' && r.is_completed === true).length, [allResources]);
  const completedPractice = useMemo(() => allResources.filter(r => r.resource_type === 'Practice' && r.is_completed === true).length, [allResources]);
  const completedTests    = useMemo(() => allResources.filter(r => r.resource_type === 'Test' && r.is_completed === true).length, [allResources]);
  const completedIR       = useMemo(() => allResources.filter(r => r.resource_type === 'Image Interpretation' && r.is_completed === true).length, [allResources]);

  const totalResources = allResources.length;
  const completed      = useMemo(() => allResources.filter(r => r.is_completed === true).length, [allResources]);
  const attempted      = (individualTraineeProfile?.testQuery ?? []).length;
  const totalAttempts  = interactionStats.data.reduce((sum, r) => sum + Number(r.attempt_count), 0);

  const nextModule = individualTraineeProfile?.nextModule ?? null;
  const nextModuleLRPct = nextModule
    ? Math.round((Number(nextModule.completed_learning_resources) / Number(nextModule.total_learning_resources)) * 100) || 0
    : 0;
  const nextModuleIRPct = nextModule
    ? Math.round((Number(nextModule.completed_image_interpretations) / Number(nextModule.total_image_interpretations)) * 100) || 0
    : 0;

  // ── Last Completed Module ─────────────────────────────────
  // Groups resources by learning_module_id; finds the module with the most
  // recently completed resource (module does not need to be 100% done).
  const lastCompletedModuleData = useMemo(() => {
    const moduleMap = {};
    allResources.forEach(r => {
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

    // Find module with at least one completed resource, pick latest updated_at
    const modulesWithCompletion = Object.values(moduleMap)
      .map(m => {
        const completedResources = m.resources.filter(r => r.is_completed === true && r.updated_at);
        const totalCount     = m.resources.filter(r => r.resource_id).length;
        const completedCount = completedResources.length;
        const lastDate = completedResources
          .map(r => new Date(r.updated_at))
          .sort((a, b) => b - a)[0] ?? null;
        return { ...m, completedCount, totalCount, lastDate };
      })
      .filter(m => m.completedCount > 0 && m.lastDate)
      .sort((a, b) => b.lastDate - a.lastDate);

    return modulesWithCompletion[0] ?? null;
  }, [allResources]);

  // ── Weekly Practice Streak ────────────────────────────────
  const weeklyStreak = useMemo(() => {
    const completedDates = allResources
      .filter(r => r.is_completed === true && r.updated_at)
      .map(r => new Date(r.updated_at));

    if (completedDates.length === 0) return 0;

    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd   = endOfWeek(now, { weekStartsOn: 1 });
    const hasThisWeek   = completedDates.some(d => isWithinInterval(d, { start: thisWeekStart, end: thisWeekEnd }));

    let streak = 0;
    // If no activity this week, start counting from last week
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
  }, [allResources]);

  // ── Last 8 Weeks Activity (bar chart for streak card) ────
  const last8WeeksActivity = useMemo(() => {
    const completedDates = allResources
      .filter(r => r.is_completed === true && r.updated_at)
      .map(r => new Date(r.updated_at));

    return Array.from({ length: 8 }, (_, i) => {
      const wStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
      const wEnd   = endOfWeek(wStart, { weekStartsOn: 1 });
      const count  = completedDates.filter(d => isWithinInterval(d, { start: wStart, end: wEnd })).length;
      return {
        week: format(wStart, 'MMM d'),
        count,
        isCurrentWeek: i === 7,
      };
    });
  }, [allResources]);

  // ── Test Scores & Reattempts ──────────────────────────────
  const testScores    = (individualTraineeProfile?.testQuery ?? [])[0] ?? null;
  const testReattempts = useMemo(() => individualTraineeProfile?.reAttempts ?? [], [individualTraineeProfile.reAttempts]);
  const moduleCompletion = useMemo(() => individualTraineeProfile?.moduleCompletion ?? [], [individualTraineeProfile.moduleCompletion]);

  // ── MS — MindSparks ───────────────────────────────────────
  const msTotalAttempts  = totalAttempts;
  const msResourceCount  = interactionStats.data.length;

  // ── OB — OB Booster resources ────────────────────────────
  const obResources = useMemo(() =>
    allResources.filter(r =>
      r.resource_topic?.toLowerCase().includes('ob booster') ||
      r.resource_name?.toLowerCase().includes('ob booster') ||
      r.resource_topic?.toLowerCase().includes('ob boosters')
    ), [allResources]);
  const obCompleted = obResources.filter(r => r.is_completed === true).length;

  // ── Practice & Test resource lists ───────────────────────
  const practiceResources = useMemo(() => {
    const seen = new Set();
    return allResources
      .filter(r => r.resource_type === 'Practice' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
      .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
  }, [allResources]);

  const testResourcesList = useMemo(() => {
    const seen = new Set();
    return allResources
      .filter(r => r.resource_type === 'Test' && r.resource_id && !seen.has(r.resource_id) && seen.add(r.resource_id))
      .sort((a, b) => (a.resource_name || '').localeCompare(b.resource_name || ''));
  }, [allResources]);

  // P1–P4 practices, T1–T4 tests with reattempt counts
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

  // ── Learning Path Progress (group by course) ─────────────
  const learningPathProgress = useMemo(() => {
    const courseMap = {};
    moduleCompletion.forEach(m => {
      const key = m.course_name || 'Unknown Course';
      if (!courseMap[key]) courseMap[key] = { course_name: key, modules: [] };
      courseMap[key].modules.push(m);
    });
    return Object.values(courseMap);
  }, [moduleCompletion]);

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
              <div className="col-span-2 flex flex-col gap-4">
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="text-xl pt-1 font-semibold text-gray-700">
                    Welcome Back, {individualTraineeProfile.data[0]?.user_name || 'NA'}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <StatCard icon={BookOpen}      iconColor="text-blue-500"   label="Learning Resources"   completed={completedLR}       total={totalLR} />
                  <StatCard icon={Dumbbell}       iconColor="text-green-500"  label="Practices"             completed={completedPractice} total={totalPractice} />
                  <StatCard icon={ClipboardCheck} iconColor="text-orange-500" label="Tests"                 completed={completedTests}    total={totalTests} />
                  <StatCard icon={Eye}            iconColor="text-purple-500" label="Image Interpretations" completed={completedIR}       total={totalIR} />
                </div>
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">Last Score</div>
                    {testScores && (
                      <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        Last test: {formatDate(testScores.created_at)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <ScoreBadge
                      label="MS"
                      value={msTotalAttempts}
                      color="#8DC63F"
                      subLabel={`MindSpark Attempts${msResourceCount > 0 ? ` (${msResourceCount} resources)` : ''}`}
                    />
                    <ScoreBadge
                      label="OB"
                      value={obResources.length > 0 ? `${obCompleted}/${obResources.length}` : '—'}
                      color="#f97316"
                      subLabel="OB Booster"
                    />
                    <ScoreBadge
                      label="II"
                      value={totalIR > 0 ? `${completedIR}/${totalIR}` : '—'}
                      color="#a78bfa"
                      subLabel="Image Interp."
                    />
                    <ScoreBadge
                      label="T"
                      value={testScores ? `${calcAvgScore(testScores) ?? '—'}%` : '—'}
                      color="#3b82f6"
                      subLabel={testScores ? (testScores.resource_name || 'Last Test') : 'No test yet'}
                    />
                  </div>

                  {/* Test sub-scores breakdown */}
                  {testScores && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        Last Test — Sub-Scores
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {[
                          { key: 'plane_identification',       label: 'Plane Identification', color: '#3b82f6' },
                          { key: 'image_optimization',         label: 'Image Optimization',   color: '#8b5cf6' },
                          { key: 'measurement',                label: 'Measurement',          color: '#10b981' },
                          { key: 'diagnostic_interpretation',  label: 'Diagnostic Interp.',   color: '#f59e0b' },
                        ].map(({ key, label, color }) => {
                          const val = Number(testScores[key]);
                          const pct = isNaN(val) ? 0 : Math.min(100, Math.round(val));
                          return (
                            <div key={key} className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] text-gray-500">
                                <span>{label}</span>
                                <span className="font-semibold" style={{ color }}>
                                  {isNaN(val) ? '—' : `${val}%`}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%`, backgroundColor: color }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── PRACTICE & TEST PERFORMANCE (P1–P4, T1–T4) ── */}
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
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold rounded-tl">#</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Resource</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Type</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Status</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold">Last Attempted</th>
                              <th className="text-left py-2 px-2 text-xs text-gray-400 font-semibold rounded-tr">Re-Attempts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resourcePerformanceItems.map((item, idx) => (
                              <tr key={item.resource_id || idx}
                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-2 px-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    item.resource_type === 'Practice'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {item.label}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-gray-700 font-medium max-w-[180px] truncate" title={item.resource_name}>
                                  {item.resource_name || 'N/A'}
                                </td>
                                <td className="py-2 px-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.resource_type === 'Practice'
                                      ? 'bg-green-50 text-green-600'
                                      : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {item.resource_type}
                                  </span>
                                </td>
                                <td className="py-2 px-2">
                                  {item.is_completed ? (
                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                      <CheckCircle size={11} /> Done
                                    </span>
                                  ) : item.updated_at ? (
                                    <span className="text-xs text-orange-500">In Progress</span>
                                  ) : (
                                    <span className="text-xs text-gray-400">Not Started</span>
                                  )}
                                </td>
                                <td className="py-2 px-2 text-xs text-gray-500">
                                  {item.updated_at ? formatDate(item.updated_at) : '—'}
                                </td>
                                <td className="py-2 px-2">
                                  {item.reattempts > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                                      {item.reattempts}×
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Overall Test Re-Attempts */}
                      {testReattempts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                            Overall — No. of Re-Attempts
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {testReattempts.map((r, i) => (
                              <div key={i}
                                className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 text-xs">
                                <span className="text-gray-600 font-medium truncate max-w-[140px]" title={r.resource_name}>
                                  {r.resource_name}
                                </span>
                                <span className="text-orange-600 font-bold">{r.attempt_count}×</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-6">
                      No practice or test data available yet
                    </div>
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

                {/* LR Re-Attempts Interactions */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <IdentificationIcon size={16} className="text-[#8DC63F]" />
                    <div className="text-base font-semibold text-gray-700">LR — Re-Attempts Interactions</div>
                  </div>
                  <InteractionDonut
                    data={interactionStats.data}
                    loading={interactionStats.loading}
                    error={interactionStats.error}
                    totalAttempts={totalAttempts}
                  />
                </div>

                {/* ── LEARNING PATH PROGRESS ───────────────────── */}
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
                              const lrTotal = Number(mod.total_learning_resources)    || 0;
                              const lrDone  = Number(mod.completed_learning_resources) || 0;
                              const iiTotal = Number(mod.total_image_interpretations)  || 0;
                              const iiDone  = Number(mod.completed_image_interpretations) || 0;
                              const total   = lrTotal + iiTotal;
                              const done    = lrDone  + iiDone;
                              const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
                              const isDone  = total > 0 && done === total;
                              return (
                                <div key={mi}
                                  className={`rounded-lg border p-3 transition-colors ${
                                    isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}>
                                  <div className="flex justify-between items-start mb-1.5">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {mod.unit_name || mod.module_name || 'Module'}
                                      </span>
                                      {mod.unit_name && mod.module_name && (
                                        <span className="text-[10px] text-gray-400">{mod.module_name}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                      {isDone && <CheckCircle size={12} className="text-green-500" />}
                                      <span className={`text-xs font-bold ${isDone ? 'text-green-600' : 'text-gray-600'}`}>
                                        {pct}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full transition-all duration-700"
                                      style={{
                                        width: `${pct}%`,
                                        backgroundColor: isDone ? '#22c55e' : '#8DC63F',
                                      }} />
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
                    <div className="text-sm text-gray-400 text-center py-6">
                      No learning path data available
                    </div>
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
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            individualTraineeProfile.currentBatches[0]?.batch_status === 'current'
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

                {/* ── LAST COMPLETED MODULE ─────────────────── */}
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
                      {/* Mini progress bar */}
                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Resources Completed</span>
                          <span className="font-semibold text-gray-500">
                            {lastCompletedModuleData.completedCount}/{lastCompletedModuleData.totalCount}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${lastCompletedModuleData.totalCount > 0
                                ? Math.round((lastCompletedModuleData.completedCount / lastCompletedModuleData.totalCount) * 100)
                                : 0}%`,
                              backgroundColor: '#8DC63F',
                            }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-4">No module activity yet</div>
                  )}
                </div>

                {/* ── PRACTICE STREAK — WEEKLY ──────────────── */}
                <div className="border rounded-lg p-5 border-gray-300 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame size={16} className="text-orange-500" />
                    <div className="text-gray-500 font-semibold">Practice Streak</div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-2xl font-bold text-orange-500">{weeklyStreak}</span>
                      <span className="text-xs text-gray-400 leading-tight">
                        week{weeklyStreak !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-3">Weekly activity — last 8 weeks</div>

                  {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1 h-14">
                        {last8WeeksActivity.map((week, i) => {
                          const maxCount = Math.max(...last8WeeksActivity.map(w => w.count), 1);
                          const heightPct = week.count === 0 ? 15 : Math.max(20, Math.round((week.count / maxCount) * 100));
                          return (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                              <div
                                className={`w-full rounded-t transition-all duration-500 ${
                                  week.isCurrentWeek ? 'ring-1 ring-orange-400' : ''
                                }`}
                                style={{
                                  height: `${heightPct}%`,
                                  backgroundColor: week.count === 0
                                    ? '#e5e7eb'
                                    : week.count <= 3
                                    ? '#bbf7d0'
                                    : week.count <= 7
                                    ? '#8DC63F'
                                    : '#16a34a',
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
