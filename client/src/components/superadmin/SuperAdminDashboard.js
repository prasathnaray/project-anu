import React, { useState, useEffect } from 'react';
import NavBar from '../navBar';
import SideBar from '../sideBar';
import { 
  GraduationCap, 
  Landmark, 
  Users, 
  Presentation, 
  BookOpen, 
  Activity, 
  LayoutDashboard,
  ClipboardPenLine,
  NotepadText
} from 'lucide-react';
import GetScanCentersAPI from '../../API/GetScanCentersAPI';
import GetCoursesAPI from '../../API/GetCoursesAPI';
import GetIntructorsAPI from '../../API/GetIntructorsAPI';
import TraineeListAPI from '../../API/TraineeListAPI';
import UserStatsAPI from '../../API/UserStatsAPI';
import getDashboardAPI from '../../API/dashboardAPI';
import { useNavigate } from 'react-router-dom';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  const [dashboardState, setDashboardState] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({
    institutions: null,
    students: null,
    instructors: null,
    courses: null,
    activeUsers: null,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('user_token');
        try {
          const dashRes = await getDashboardAPI();
          if (dashRes?.data) setDashboardData(dashRes.data);
        } catch (e) {
          console.log('Dashboard API error:', e);
        }

        const [instRes, coursesRes, instructorsRes, traineesRes, userStatsRes] = await Promise.allSettled([
          GetScanCentersAPI(token, 1, 100),
          GetCoursesAPI(token),
          GetIntructorsAPI(token, 1, 100),
          TraineeListAPI(1, 100),
          UserStatsAPI(token)
        ]);

        let instCount = null;
        if (instRes.status === 'fulfilled' && instRes.value?.data) {
          instCount = Array.isArray(instRes.value.data) ? instRes.value.data.length : (instRes.value.data.total ?? null);
        }

        let coursesCount = null;
        if (coursesRes.status === 'fulfilled' && coursesRes.value?.data) {
          coursesCount = Array.isArray(coursesRes.value.data) ? coursesRes.value.data.length : (coursesRes.value.data.total ?? null);
        }

        let instructorsCount = null;
        if (instructorsRes.status === 'fulfilled' && instructorsRes.value?.data) {
          const rawCount = Array.isArray(instructorsRes.value.data) ? instructorsRes.value.data.length : instructorsRes.value.data.total;
          instructorsCount = rawCount == null ? null : Number(rawCount).toLocaleString();
        }

        let traineesCount = null;
        if (traineesRes.status === 'fulfilled' && traineesRes.value?.data) {
          const rawCount = Array.isArray(traineesRes.value.data) ? traineesRes.value.data.length : traineesRes.value.data.total;
          traineesCount = rawCount == null ? null : Number(rawCount).toLocaleString();
        }

        let activeCount = null;
        if (userStatsRes.status === 'fulfilled' && userStatsRes.value?.data) {
          const rawCount = userStatsRes.value.data.activeUsers ?? userStatsRes.value.data.totalActive;
          activeCount = rawCount == null ? null : Number(rawCount).toLocaleString();
        }

        setStats({
          institutions: instCount,
          students: traineesCount,
          instructors: instructorsCount,
          courses: coursesCount,
          activeUsers: activeCount,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchDashboardStats();
  }, []);

  const RenderGenderPie = () => (
    <div className="flex items-center justify-center gap-6 my-4">
      <span className="text-sm text-gray-500">No data available</span>
    </div>
  );

  const RenderTargetedChart = () => (
    <div className="flex items-center justify-center gap-6 my-4">
      <span className="text-sm text-gray-500">No data available</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        {/* Sidebar */}
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>

        {/* Main Dashboard Area */}
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}
        >
          {/* Sub-Header Navigation Tabs */}
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center gap-2 border">
            <button
              onClick={() => setDashboardState('dashboard')}
              className={`flex justify-between gap-2 items-center px-2 py-[2px] rounded cursor-pointer font-semibold transition-all ease-in-out duration-300 ${
                dashboardState === 'dashboard'
                  ? 'bg-[#8DC63F] text-white'
                  : 'hover:bg-gray-100 hover:text-[#8DC63F]'
              }`}
            >
              <span className="text-[13px]">Overview</span>
            </button>

            <button
              onClick={() => setDashboardState('users')}
              className={`flex items-center gap-1 px-2 py-[2px] rounded cursor-pointer transition-all duration-300 ease-in-out font-semibold ${
                dashboardState === 'users'
                  ? 'bg-[#8DC63F] text-white'
                  : 'hover:bg-gray-100 hover:text-[#8DC63F]'
              }`}
            >
              <span className="text-[13px]">Users</span>
            </button>
          </div>

          {dashboardState === 'dashboard' && (
            <div className="px-3 grid grid-cols-3 gap-4">
              {/* Left Column (2 Cols wide) */}
              <div
                className="border bg-white h-[calc(100vh-5rem)] overflow-y-auto mb-4 rounded-sm mt-3 col-span-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="m-2 flex gap-4 items-center">
                  <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                    <LayoutDashboard size={21} />
                  </div>
                  <span className="text-lg text-gray-500 font-semibold">Super Admin Dashboard</span>
                </div>

                {/* 5 KPI Cards Section */}
                <div className="border border-t-1 border-r-0 border-l-0 border-b-0 p-4">
                  <div className="grid grid-cols-5 gap-3">
                    {/* Card 1: Total Institutions */}
                    <div
                      className="border p-2 rounded shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate('/academics')}
                    >
                      <span className="font-semibold text-xs text-gray-600 block truncate">Institutions</span>
                      <div className="flex justify-between items-center px-1 pt-4">
                        <div className="text-[#8DC63F]">
                          <Landmark size={36} />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {stats.institutions}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Total Students */}
                    <div
                      className="border p-2 rounded shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate('/trainees')}
                    >
                      <span className="font-semibold text-xs text-gray-600 block truncate">Students</span>
                      <div className="flex justify-between items-center px-1 pt-4">
                        <div className="text-[#8DC63F]">
                          <GraduationCap size={36} />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {stats.students}
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Total Instructors */}
                    <div
                      className="border p-2 rounded shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate('/instructors')}
                    >
                      <span className="font-semibold text-xs text-gray-600 block truncate">Instructors</span>
                      <div className="flex justify-between items-center px-1 pt-4">
                        <div className="text-[#8DC63F]">
                          <Presentation size={36} />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {stats.instructors}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Total Courses */}
                    <div
                      className="border p-2 rounded shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate('/certificate')}
                    >
                      <span className="font-semibold text-xs text-gray-600 block truncate">Courses</span>
                      <div className="flex justify-between items-center px-1 pt-4">
                        <div className="text-[#8DC63F]">
                          <BookOpen size={36} />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {stats.courses}
                        </div>
                      </div>
                    </div>

                    {/* Card 5: Active Users */}
                    <div
                      className="border p-2 rounded shadow-md cursor-pointer hover:shadow-lg transition-all"
                    >
                      <span className="font-semibold text-xs text-gray-600 block truncate">Active Users</span>
                      <div className="flex justify-between items-center px-1 pt-4">
                        <div className="text-[#8DC63F]">
                          <Activity size={36} />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {stats.activeUsers}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="flex justify-between items-center font-bold text-gray-600">
                  <div className="my-2 mx-5 text-lg">Gender Ratio</div>
                </div>
                <div className="flex justify-center items-center">
                  <RenderGenderPie />
                </div>

                <div className="my-2 mx-5 text-lg font-bold text-gray-600">
                  Targeted Learning v Batch Ratio
                </div>
                <div className="flex justify-center items-center">
                  <RenderTargetedChart />
                </div>
              </div>

              {/* Right Column (1 Col wide) */}
              <div className="flex flex-col gap-4 mt-3 h-[calc(100vh-5rem)]">
                {/* Top Performing Trainees */}
                <div
                  className="border bg-white rounded-lg shadow-sm p-4 flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-4 items-center mb-4 pb-2 border-b">
                    <div className="text-white bg-[#8DC63F] p-2 rounded-lg">
                      <GraduationCap size={20} />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      Top Performing Trainees
                    </span>
                  </div>

                  {dashboardData?.TopPerformingTraineesGlobal?.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {dashboardData.TopPerformingTraineesGlobal.map((trainee, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-lime-100 text-[#8DC63F] flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {trainee.user_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate w-32 sm:w-auto">
                                {trainee.user_email}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-800">
                              {trainee.completed_count}
                            </span>
                            <span className="text-[10px] text-gray-500">completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No data available</p>
                  )}
                </div>

                {/* Recent Platform Activity */}
                <div
                  className="border bg-white rounded-lg shadow-sm p-4 flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-4 items-center mb-4 pb-2 border-b">
                    <div className="text-white bg-[#8DC63F] p-2 rounded-lg">
                      <NotepadText size={20} />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      Recent Platform Activity
                    </span>
                  </div>

                  {dashboardData?.PlatformRecentActivity?.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {dashboardData.PlatformRecentActivity.map((activity, index) => (
                        <div key={index} className="relative pl-4 border-l-2 border-lime-300 py-1">
                          <div className="absolute w-2 h-2 bg-[#8DC63F] rounded-full -left-[5px] top-2"></div>
                          <p className="text-xs text-gray-800"><span className="font-semibold">{activity.user_name}</span> completed {activity.resource_name}</p>
                          <p className="text-[10px] text-gray-400">{activity.updated_at}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No data available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {dashboardState === 'users' && (
            <div className="p-4 bg-white m-4 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">User Overview</h3>
              <p className="text-sm text-gray-500">Managing trainees and instructors across institutions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
