import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "../navBar";
import SideBar from "../sideBar";
import { ClipboardPenLine, EllipsisIcon, EllipsisVerticalIcon, GraduationCap, LayoutDashboard, NotepadText, SlidersHorizontal } from "lucide-react";
import getDashboardAPI from "../../API/dashboardAPI";
import { Book01Icon, Calendar01Icon } from "hugeicons-react";
import BasicPie from "../../charts/PieChart";
import TargetedLearningChart from "../../charts/TargetedLearningChart";
import UsersA from "./DashboardComponents/UsersA";
import CourseA from "./DashboardComponents/CourseA";
import BatchA from "./DashboardComponents/BatchA";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { useNotifications } from '../../Hooks/useNotification';
function AdminDashboard(){
    // const { notifications, loading } = useNotifications();
    const navigate = useNavigate();
    const [buttonOpen, setButtonOpen] = useState(true);
    const handleButtonOpen = () => {
        setButtonOpen(!buttonOpen);
    };

    const [dashboardState, setDashboardState] = React.useState('dashboard');
    console.log(dashboardState);
    const [dashboardData, setDashboardData] = useState([])
    const [showw, setShoww] = useState(false);
    useEffect(() => {
        setShoww(true);
    }, [])
    const handleDashboardApi = async() => {
        try
        {   
            //const token = localStorage.getItem('user_token');
            const result = await getDashboardAPI();
            setDashboardData(result.data);
        }
        catch(err)
        {
            //console.log(err)
            if(err?.data?.status == 401)
            {
              navigate('/');
              return;
            }
            setDashboardData([]);
        }
    }
    useEffect(() => {
        handleDashboardApi()
        //console.log(dashboardData);
    }, [])
    console.log(dashboardData)
        // if (loading) return <p>Loading notifications...</p>;

        //DISABLE RIGHT cliCK
    return (
  <div className="flex flex-col min-h-screen">
    <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
      <NavBar />
    </div>
    <div className="flex flex-grow pt-12">
      <div>
        <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
      </div>
      <div
        className={`${
          buttonOpen ? "ms-[221px]" : "ms-[55.5px]"
        } min-w-0 flex-grow overflow-y-auto bg-[#f6f9f3] h-[calc(100vh-3rem)]`}
      >
        {/* <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
                                <button onClick={() => setDashboardState('dashboard')}  className="flex justify-between gap-2 items-center bg-[#8DC63F] px-2 py-[2px] rounded cursor-pointer text-gray-100 font-semibold hover:rounded-full transition-all ease-in-out duration-300">
                                      <span className="text-[13px]">Overview</span>
                                </button>
                                <button onClick={() => setDashboardState('users')} className="flex items-center gap-1 px-2 py-[2px] rounded hover:bg-[#8DC63F] hover:text-white cursor-pointer transition-all duration-300 ease-in-out hover:rounded">
                                      <span className="text-[13px]" >Users</span>
                                </button>
                                <button onClick={() => setDashboardState('courses')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded">
                                      <span className="text-[13px]" >Course</span>
                                </button>
                                <button onClick={() => setDashboardState('batches')} className="flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rounded-full">
                                      <span className="text-[13px]">Batch</span>
                                </button>
        </div> */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#e1ead8] bg-white px-3 py-2.5 sm:px-5">
            <button
              onClick={() => setDashboardState("dashboard")}
              className={`flex justify-between gap-2 items-center px-2 py-[2px] rounded cursor-pointer font-semibold transition-all ease-in-out duration-300 ${
                dashboardState === "dashboard"
                  ? "bg-[#eef8e5] text-[#5f9222] shadow-sm"
                  : "text-slate-500 hover:bg-[#f5f9f1] hover:text-[#719f2c]"
              }`}
            >
              <span className="text-[13px]">Overview</span>
            </button>

            <button
              onClick={() => setDashboardState("users")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "users"
                  ? "bg-[#eef8e5] text-[#5f9222] shadow-sm"
                  : "text-slate-500 hover:bg-[#f5f9f1] hover:text-[#719f2c]"
              }`}
            >
              <span className="text-[13px]">Users</span>
            </button>

            {/* <button
              onClick={() => setDashboardState("courses")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "courses"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Course</span>
            </button> */}

            {/* <button
              onClick={() => setDashboardState("batches")}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === "batches"
                  ? "bg-[#8DC63F] text-white"
                  : "hover:bg-gray-100 hover:text-[#8DC63F]"
              }`}
            >
              <span className="text-[13px]">Batch</span>
            </button> */}
          </div>
        {dashboardState == "dashboard" && (
          <div className={`grid grid-cols-1 gap-5 px-3 py-4 sm:px-5 lg:px-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.8fr)] contentt ${showw ? 'visible' : ''} `}>
          <div className="min-w-0 rounded-3xl border border-[#e1ead8] bg-white h-[calc(100vh-5rem)] overflow-y-auto mb-4 mt-0" style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                }}>
            <div className="flex items-center gap-3 border-b border-[#edf2e9] px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e5] text-[#719f2c]">
                 <LayoutDashboard size={21} />
              </div>
              <div><span className="block text-lg font-bold text-slate-800">General dashboard</span><span className="text-xs text-slate-400">A quick view of your learning operations</span></div>
            </div>

            <div className="border-b border-[#edf2e9] p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="group cursor-pointer rounded-2xl border border-[#e1ead8] bg-[#fbfdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#cfe3bb] hover:shadow-[0_12px_25px_-18px_rgba(72,104,30,.65)]" onClick={() => navigate('/trainees')}>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Trainees</span>
                  <div className="flex items-end justify-between pt-5">
                    <div className="text-[#8DC63F]">
                      <GraduationCap size={43} />
                    </div>
                    <div className="text-3xl font-bold text-slate-700">
                      {dashboardData?.getTraineesIns?.rows?.find(r => r.user_role == 103 || r.user_role === '103')?.count || 0}
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer rounded-2xl border border-[#e1ead8] bg-[#fbfdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#cfe3bb] hover:shadow-[0_12px_25px_-18px_rgba(72,104,30,.65)]" onClick={() => navigate('/instructors')}>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Instructors</span>
                  <div className="flex items-end justify-between pt-5">
                    <div className="text-[#8DC63F]">
                      <ClipboardPenLine size={43} />
                    </div>
                    <div className="text-3xl font-bold text-slate-700">
                      {dashboardData?.getTraineesIns?.rows?.find(r => r.user_role == 102 || r.user_role === '102')?.count || 0}
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer rounded-2xl border border-[#e1ead8] bg-[#fbfdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#cfe3bb] hover:shadow-[0_12px_25px_-18px_rgba(72,104,30,.65)]" onClick={() => navigate('/batch')}>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Batches</span>
                  <div className="flex items-end justify-between pt-5">
                    <div className="text-[#8DC63F]">
                      <GraduationCap size={43} />
                    </div>
                    <div className="text-3xl font-bold text-slate-700">
                       {dashboardData?.getBatchDas?.rows[0]?.count || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 pt-5 sm:px-6" style={{ fontWeight: 'bold', color: '#334155' }}>
                <div className="text-base">Gender ratio</div>
                <div className="mx-5">
                  {/* <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
                    <Select
                      labelId="test-completion-label"
                      id="test-completion-select"
                    >
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="week">This Week</MenuItem>
                      <MenuItem value="month">This Month</MenuItem>
                      <MenuItem value="all">All Time</MenuItem>
                    </Select>
                  </FormControl> */}
                </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="ms-5">
                 <BasicPie />
              </div>
            </div>
            <div className="mx-5 mt-7 text-base sm:mx-6" style={{ fontWeight: 'bold', color: '#334155' }}>Targeted learning vs batch ratio</div>
            <div className="flex justify-center items-center">
              <div className="ms-5">
                 <TargetedLearningChart targetedLearning={dashboardData} />
              </div>
            </div>

            {/* Instructor Analysis Section */}
            <div className="my-6 mx-5 sm:mx-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-500 text-white rounded-md">
                   <ClipboardPenLine size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-700">Instructor Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Top Instructors by Trainee Count */}
                <div className="rounded-2xl border border-[#e1ead8] bg-[#fbfdf9] p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <GraduationCap size={16} className="text-green-500"/>
                    Top Instructors (by Trainees)
                  </h3>
                  <div className="flex flex-col gap-2">
                    {dashboardData?.TopInstructorsByTrainees?.map((inst, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{inst.user_name}</span>
                          <span className="text-[10px] text-gray-500">{inst.user_email}</span>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          {inst.total_trainees} Trainees
                        </div>
                      </div>
                    ))}
                    {(!dashboardData?.TopInstructorsByTrainees || dashboardData.TopInstructorsByTrainees.length === 0) && (
                      <p className="text-xs text-gray-400 text-center py-4">No instructor data available</p>
                    )}
                  </div>
                </div>

                {/* Instructor Volume Activity */}
                <div className="rounded-2xl border border-[#e1ead8] bg-[#fbfdf9] p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <NotepadText size={16} className="text-green-500"/>
                    Content Contribution (Volumes)
                  </h3>
                  <div className="flex flex-col gap-2">
                    {dashboardData?.InstructorVolumeActivity?.map((inst, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-800">{inst.user_name}</span>
                        <div className="flex items-center gap-2">
                           <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${Math.min(100, (inst.total_volumes / (dashboardData.InstructorVolumeActivity[0]?.total_volumes || 1)) * 100)}%` }}
                              ></div>
                           </div>
                           <span className="text-xs font-bold text-gray-600">{inst.total_volumes}</span>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData?.InstructorVolumeActivity || dashboardData.InstructorVolumeActivity.length === 0) && (
                      <p className="text-xs text-gray-400 text-center py-4">No volume activity recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-auto min-w-0 flex-col gap-5 xl:mt-0 xl:h-[calc(100vh-5rem)]">
              <div className="flex-1 overflow-y-auto rounded-3xl border border-[#e1ead8] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(72,104,30,.55)]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="mb-4 flex items-center gap-3 border-b border-[#edf2e9] pb-3">
                  <div className="rounded-xl bg-[#eef8e5] p-2 text-[#719f2c]">
                    <GraduationCap size={20} />
                  </div>
                  <span className="text-base font-bold text-slate-800">Top performing trainees</span>
                </div>
                
                {dashboardData?.TopPerformingTraineesGlobal?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {dashboardData.TopPerformingTraineesGlobal.map((trainee, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{trainee.user_name}</p>
                            <p className="text-xs text-gray-500 truncate w-32 sm:w-auto">{trainee.user_email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-gray-800">{trainee.completed_count}</span>
                          <span className="text-[10px] text-gray-500">completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
                    No completion data available yet.
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto rounded-3xl border border-[#e1ead8] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(72,104,30,.55)]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="mb-4 flex items-center gap-3 border-b border-[#edf2e9] pb-3">
                  <div className="rounded-xl bg-[#eef8e5] p-2 text-[#719f2c]">
                    <NotepadText size={20} />
                  </div>
                  <span className="text-base font-bold text-slate-800">Recent platform activity</span>
                </div>
                
                {dashboardData?.PlatformRecentActivity?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {dashboardData.PlatformRecentActivity.map((activity, index) => (
                      <div key={index} className="relative pl-4 border-l-2 border-purple-200 py-2">
                        <div className="absolute w-2 h-2 bg-purple-500 rounded-full -left-[5px] top-3"></div>
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{activity.user_name}</span> completed
                        </p>
                        <p className="text-sm text-gray-600 font-medium truncate">
                          {activity.resource_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.updated_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <img src={'https://ims-traktor.web.app/img/no-events.25d14767.svg'} alt="No recent activity" className="w-[60%]"/>
                  </div>
                )}
              </div>
          </div>
        </div>
        )}
        {dashboardState == "users" && (
          <UsersA APIS={dashboardData?.BatchPerUserList}/>
        )}
        {dashboardState == "courses" && (
          <CourseA />
        )}
        {/* {dashboardState == "batches" && (
          <BatchA />
        )} */}
      </div>
    </div> 
  </div>
);
}
export default AdminDashboard;
