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

//                     <div className="border-t mt-6 pt-1 mb-2">
//                       <div className="flex justify-between items-center pt-2">
//                         <div className="text-gray-600 font-semibold">
//                           Total chapter access
//                         </div>
//                         <div>{counts.total_chapters_associated.size}</div>
//                       </div>
//                     </div>

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


import React, { useState, useEffect } from 'react'
import NavBar from '../navBar'
import SideBar from '../sideBar'
import { useNavigate, useParams } from 'react-router-dom';
import OverallCompletion from '../../charts/OverallCompletion';
import { GetQueriesAPI } from '../../API/GetQueriesAPI';
import { Check, Clock, PlaneIcon } from 'lucide-react';
import { IdentificationIcon } from 'hugeicons-react';
import TraineeProfileAPI from '../../API/TraineeProfileAPI';
function TraineeDashboard() {
  const navigate = useNavigate();
  const { people_id } = useParams();
  const [buttonOpen, setButtonOpen] = React.useState(true);
  const [profile, setProfile] = React.useState(false);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);
  
  // ✅ Add queries state
  const [queries, setQueries] = useState({
    pending: 0,
    resolved: 0,
    total: 0,
    loading: false,
    error: null
  });

  // ✅ Fetch queries data
  const handleFetchQueries = async () => {
    try {
      setQueries(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem('user_token');
      const response = await GetQueriesAPI(token);
      
      // Calculate pending and resolved counts
      const pendingCount = response.result.filter(q => q.status === 'pending').length;
      const resolvedCount = response.result.filter(q => q.status === 'resolved').length;
      
      setQueries({
        pending: pendingCount,
        resolved: resolvedCount,
        total: response.total,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching queries:', error);
      setQueries(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };
 //format date time

const formatDateTime = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });
};
  // ✅ Call API on component mount
  const [loading, setLoading] = useState(false);
  const [individualTraineeProfile, setIndividualTraineeProfile] = React.useState({
    data: [],
    instructors: [],
    currentBatches: [],
    certificates: [],
  });
  const handleApiCall = async (people_id) => {
    try {
      setLoading(true);
      // const token = localStorage.getItem('user_token');
      const response = await TraineeProfileAPI(people_id);
      setIndividualTraineeProfile(response.data);
    } catch (error) {
      console.error("Error fetching trainee profile:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const resolvedId = people_id || localStorage.getItem('people_id');
    handleApiCall(resolvedId);
  }, [])

  // Calculate from your API response
const totalResources = (individualTraineeProfile?.data ?? []).filter(r => r.resource_id !== null).length;
const completed = (individualTraineeProfile?.data ?? []).filter(r => r.is_completed === true).length;
const attempted = (individualTraineeProfile?.testQuery ?? []).length;
  useEffect(() => {
    handleFetchQueries();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
            <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
                  <NavBar />
             </div>
             <div className="flex flex-grow pt-12">
              <div> 
                          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen}/>
              </div>
              <div
                className={`${buttonOpen ? "ms-[221px]" : "ms-[55.5px]"} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
              >
                 <div className="p-4 text-md">
                        <div className=" grid grid-cols-3 gap-5">
                          <div className="col-span-2 border rounded-lg p-5 border-gray-300 bg-white">
                              <div className="">Welcome back</div>
                              <div className="text-xl pt-2">Good afternoon, {people_id || "Abiya!"}</div>

                              <div className="mt-5 grid grid-cols-3 gap-3">
                                    <div className="border shadow-md">
                                          <div className="flex justify-between items-center p-2">
                                                 <div className="text-green-500"><IdentificationIcon size={25} /></div>
                                                 <div className="font-medium">
                                                      <div>Plane Accuracy</div>
                                                      <div className="flex justify-end items-center text-2xl font-semibold">85%</div>
                                                  </div>
                                          </div>
                                    </div>
                                    <div className="border shadow-md">
                                          <div className="flex justify-between items-center p-2">
                                                 <div className="text-green-500"><Clock size={25} /></div>
                                                 <div className="font-medium">
                                                        <div>Avg Time / Scan</div>
                                                        <div className="flex justify-end items-center text-2xl font-semibold">2.8 min</div>
                                                  </div>
                                          </div>
                                    </div>
                                    <div className="border shadow-md">
                                          <div className="flex justify-between items-center p-2">
                                                 <div className="text-green-500"><Check size={25} /></div>
                                                 <div className="font-medium">
                                                      <div>Success Rate</div>
                                                      <div className="flex justify-end items-center text-2xl font-semibold">75%</div>
                                                 </div>
                                          </div>
                                    </div>
                              </div>
                              <div className="mt-5 border-t pt-3">
                                    <div className="text-xl pt-2">Queries Raised</div>
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                      <div className="border shadow-md p-4 rounded">
                                        <div className="flex justify-between items-center">
                                          <div className="font-medium text-gray-600">Total Queries</div>
                                          <div className="text-2xl font-semibold text-[#8DC63F]">
                                            {queries.loading ? (
                                              <div className="w-5 h-5 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                              queries.total
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="border shadow-md p-4 rounded">
                                        <div className="flex justify-between items-center">
                                          <div className="font-medium text-gray-600">Pending</div>
                                          <div className="text-2xl font-semibold text-orange-500">
                                            {queries.loading ? (
                                              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                              queries.pending
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="border shadow-md p-4 rounded">
                                        <div className="flex justify-between items-center">
                                          <div className="font-medium text-gray-600">Resolved</div>
                                          <div className="text-2xl font-semibold text-green-600">
                                            {queries.loading ? (
                                              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                              queries.resolved
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Error message */}
                                    {queries.error && (
                                      <div className="mt-3 p-3 bg-red-100 text-red-700 rounded text-sm">
                                        Error loading queries: {queries.error}
                                      </div>
                                    )}
                              </div>
                              <div className="mt-5 border-t pt-3">
                                      <div>Repeated Attempt Interactions (LR)</div>           
                              </div>
                          </div>
                          <div className="col-span-1 border rounded-lg p-5 border-gray-300 bg-white">
                              <div className="font-med text-gray-500">Associated Batch</div>
                              <div className="grid grid-cols-2 mt-2">
                                    <div className="text-sm p-1">
                                          <div>Batch Name</div>
                                          <div className="font-semibold">{individualTraineeProfile.currentBatches[0]?.batch_name || 'N/A'}</div>
                                    </div>
                                    <div className="text-sm p-1">
                                          <div>Valid till</div>
                                          <div className="font-semibold">{formatDateTime(individualTraineeProfile.currentBatches[0]?.batch_end_date)}</div>
                                    </div>
                              </div>
                              <div className="text-md text-gray-500 mt-5">Overall Progress</div>
                              <div className="flex justify-center items-center">
                                  <OverallCompletion 
                                      data={{
                                        totalResources,
                                        completed,
                                        attempted
                                      }}
                                  />
                                  </div>
                          </div>
                        </div>
                 </div>
              </div>
         </div>
    </div>
  )
}

export default TraineeDashboard