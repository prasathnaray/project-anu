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
import SuperAdminStatsAPI from '../../API/SuperAdminStatsAPI';
import { useNavigate } from 'react-router-dom';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => {
    setButtonOpen(!buttonOpen);
  };

  const [dashboardState, setDashboardState] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    institutions: 0,
    students: 0,
    instructors: 0,
    courses: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      try {
        let response = await SuperAdminStatsAPI();
        let payload = response?.data?.data || response?.data;

        if (!payload || (payload.institutions == null && !payload.superAdminMetrics)) {
          response = await getDashboardAPI();
          payload = response?.data?.data || response?.data;
        }

        if (isMounted && payload) {
          setDashboardData(payload);
          const m = payload.superAdminMetrics || payload;
          const inst = m.institutions ?? payload.institutions ?? 0;
          const stud = m.students ?? payload.students ?? 0;
          const instr = m.instructors ?? payload.instructors ?? 0;
          const crs = m.courses ?? payload.courses ?? 0;
          const act = m.active_users ?? m.activeUsers ?? payload.activeUsers ?? payload.active_users ?? 0;

          setStats({
            institutions: Number(inst).toLocaleString(),
            students: Number(stud).toLocaleString(),
            instructors: Number(instr).toLocaleString(),
            courses: Number(crs).toLocaleString(),
            activeUsers: Number(act).toLocaleString(),
          });
        }
      } catch (err) {
        console.error('Error fetching superadmin stats:', err);
      }
    };

    fetchDashboardStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const getRoleLabel = (role) => {
    const r = String(role);
    if (r === '99') return { text: 'Super Admin', bg: 'bg-purple-100 text-purple-700' };
    if (r === '101') return { text: 'Admin', bg: 'bg-blue-100 text-blue-700' };
    if (r === '102') return { text: 'Instructor', bg: 'bg-amber-100 text-amber-700' };
    if (r === '103') return { text: 'Student', bg: 'bg-emerald-100 text-emerald-700' };
    return { text: 'User', bg: 'bg-gray-100 text-gray-700' };
  };

  const activeUsers = dashboardData?.activeUsersList || [];
  const filteredActiveUsers = activeUsers.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (user.user_name && user.user_name.toLowerCase().includes(term)) ||
      (user.user_email && user.user_email.toLowerCase().includes(term)) ||
      (user.centre_name && user.centre_name.toLowerCase().includes(term))
    );
  });

  // Dynamic real course distribution calculation from database
  const rawDist = dashboardData?.courseDistribution || [];
  const totalDistCount = rawDist.reduce((sum, item) => sum + Number(item.count || 0), 0) || 1;
  const categoryColors = {
    Institution: '#a855f7',
    Core: '#3b82f6',
    Specialized: '#ec4899',
    General: '#14b8a6',
  };
  const categoryBgColors = {
    Institution: 'bg-purple-500',
    Core: 'bg-blue-500',
    Specialized: 'bg-pink-500',
    General: 'bg-teal-500',
  };

  let accumPct = 0;
  const courseDistItems = rawDist.map((item) => {
    const count = Number(item.count || 0);
    const pct = Math.round((count / totalDistCount) * 100);
    const offset = accumPct;
    accumPct += pct;
    return {
      category: item.category,
      count,
      pct,
      offset,
      strokeColor: categoryColors[item.category] || '#f59e0b',
      bgColor: categoryBgColors[item.category] || 'bg-amber-500',
    };
  });

  // Dynamic real platform growth calculation from database
  const rawGrowth = dashboardData?.platformGrowth || [];
  const maxGrowthVal = Math.max(
    ...rawGrowth.map((g) => Math.max(Number(g.students || 0), Number(g.courses || 0))),
    10
  );
  const growthPoints = rawGrowth.map((g, idx) => {
    const x = idx * (300 / Math.max(rawGrowth.length - 1, 1));
    const sY = 90 - (Number(g.students || 0) / maxGrowthVal) * 70;
    const cY = 90 - (Number(g.courses || 0) / maxGrowthVal) * 70;
    return { month: g.month, x, sY, cY, students: g.students, courses: g.courses };
  });

  const studentPath = growthPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.sY}`, '');
  const coursePath = growthPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.cY}`, '');

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
              <span className="text-[13px]">Active Users (24h)</span>
            </button>
          </div>

          {dashboardState === 'dashboard' && (
            <div className="p-3 flex flex-col gap-4">
              {/* Header Title Banner */}
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-white bg-[#8DC63F] p-2 rounded-full">
                    <LayoutDashboard size={21} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Super Admin Dashboard</h2>
                    <p className="text-xs text-gray-500">Manage your entire LMS platform from one place</p>
                  </div>
                </div>
              </div>

              {/* 5 KPI Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Card 1: Total Institutions */}
                <div
                  className="bg-white border p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  onClick={() => navigate('/academics')}
                >
                  <span className="font-semibold text-xs text-gray-500 block truncate">Total Institutions</span>
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-[#8DC63F] bg-lime-50 p-2.5 rounded-lg">
                      <Landmark size={28} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.institutions}
                    </div>
                  </div>
                </div>

                {/* Card 2: Total Students */}
                <div
                  className="bg-white border p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  onClick={() => navigate('/trainees')}
                >
                  <span className="font-semibold text-xs text-gray-500 block truncate">Total Students</span>
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-[#8DC63F] bg-lime-50 p-2.5 rounded-lg">
                      <GraduationCap size={28} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.students}
                    </div>
                  </div>
                </div>

                {/* Card 3: Total Instructors */}
                <div
                  className="bg-white border p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  onClick={() => navigate('/instructors')}
                >
                  <span className="font-semibold text-xs text-gray-500 block truncate">Total Instructors</span>
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-[#8DC63F] bg-lime-50 p-2.5 rounded-lg">
                      <Presentation size={28} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.instructors}
                    </div>
                  </div>
                </div>

                {/* Card 4: Total Courses */}
                <div
                  className="bg-white border p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  onClick={() => navigate('/certificate')}
                >
                  <span className="font-semibold text-xs text-gray-500 block truncate">Total Courses</span>
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-[#8DC63F] bg-lime-50 p-2.5 rounded-lg">
                      <BookOpen size={28} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.courses}
                    </div>
                  </div>
                </div>

                {/* Card 5: Active Users */}
                <div
                  className="bg-white border p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  onClick={() => setDashboardState('users')}
                >
                  <span className="font-semibold text-xs text-gray-500 block truncate">Active Users</span>
                  <div className="flex justify-between items-center pt-3">
                    <div className="text-[#8DC63F] bg-lime-50 p-2.5 rounded-lg">
                      <Activity size={28} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.activeUsers}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Panels Section Below Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Panel 1: Institution Activity */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">Institution Activity</h4>
                    <button onClick={() => navigate('/academics')} className="text-xs text-blue-600 font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 mt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-gray-400 font-medium border-b bg-gray-50/50">
                          <th className="py-2 px-2">Institution</th>
                          <th className="py-2 px-2">Students</th>
                          <th className="py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(dashboardData?.institutionActivity || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60">
                            <td className="py-2 px-2 font-medium text-gray-700 truncate max-w-[120px]">{item.institution}</td>
                            <td className="py-2 px-2 text-gray-600 font-mono">{Number(item.students).toLocaleString()}</td>
                            <td className="py-2 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Panel 2: Course Distribution */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">Course Distribution</h4>
                    <button onClick={() => navigate('/certificate')} className="text-xs text-blue-600 font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="flex items-center justify-around py-2 gap-2 flex-1">
                    {/* Donut Chart Graphic */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {courseDistItems.map((item, idx) => (
                          <circle
                            key={idx}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke={item.strokeColor}
                            strokeWidth="4.5"
                            strokeDasharray={`${item.pct} 100`}
                            strokeDashoffset={`-${item.offset}`}
                          />
                        ))}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-bold text-gray-800">{stats.courses}</span>
                        <span className="text-[10px] text-gray-400">Courses</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                      {courseDistItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-sm ${item.bgColor}`}></span>
                          <span className="truncate">{item.category} - {item.pct}% ({item.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel 3: Platform Growth */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">Platform Growth</h4>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Students</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Courses</span>
                    </div>
                  </div>
                  <div className="w-full flex-1 flex flex-col justify-center pt-2">
                    <svg className="w-full h-28 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#f3f4f6" strokeWidth="1" />

                      {studentPath && <path d={studentPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />}
                      {coursePath && <path d={coursePath} fill="none" stroke="#a855f7" strokeWidth="2.5" />}

                      {growthPoints.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.sY} r="3" fill="#3b82f6" />
                          <circle cx={p.x} cy={p.cY} r="3" fill="#a855f7" />
                        </g>
                      ))}
                    </svg>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                      {growthPoints.map((p, idx) => (
                        <span key={idx}>{p.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel 4: Recent Institutions */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">Recent Institutions</h4>
                    <button onClick={() => navigate('/academics')} className="text-xs text-blue-600 font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 overflow-y-auto flex-1 mt-2">
                    {(dashboardData?.recentInstitutions || []).map((inst, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <Landmark size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 truncate max-w-[130px]">{inst.name}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{inst.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inst.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {inst.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 5: Course Approvals */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">Course Approvals</h4>
                    <button onClick={() => navigate('/certificate')} className="text-xs text-blue-600 font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 mt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-gray-400 font-medium border-b bg-gray-50/50">
                          <th className="py-2 px-2">Course Name</th>
                          <th className="py-2 px-2">Institution</th>
                          <th className="py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(dashboardData?.courseApprovals || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60">
                            <td className="py-2 px-2 font-medium text-gray-700 truncate max-w-[110px]">{item.course_name}</td>
                            <td className="py-2 px-2 text-gray-500 truncate max-w-[100px]">{item.institution}</td>
                            <td className="py-2 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Panel 6: System Overview */}
                <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-64">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-sm">System Overview</h4>
                    <button className="text-xs text-blue-600 font-semibold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 text-xs text-gray-600 flex-1 justify-center">
                    <div className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-blue-500" size={16} />
                        <span>Active Courses</span>
                      </div>
                      <span className="font-bold text-gray-800">{stats.courses}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Landmark className="text-purple-500" size={16} />
                        <span>Active Institutions</span>
                      </div>
                      <span className="font-bold text-gray-800">{stats.institutions}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="text-emerald-500" size={16} />
                        <span>Total Enrollments</span>
                      </div>
                      <span className="font-bold text-gray-800">{stats.students}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Activity className="text-teal-500" size={16} />
                        <span>System Uptime</span>
                      </div>
                      <span className="font-bold text-emerald-600">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <NotepadText className="text-indigo-500" size={16} />
                        <span>Last Backup</span>
                      </div>
                      <span className="font-medium text-gray-700">Sep 07, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashboardState === 'users' && (
            <div className="p-6 bg-white m-4 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-[#8DC63F]" size={24} />
                    Active Users (Last 24 Hours)
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Users logged in during the past 24 hours ({activeUsers.length} total active)
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by name, email, center..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  />
                </div>
              </div>

              {filteredActiveUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Scan Center / Institution</th>
                        <th className="py-3 px-4">Last Login Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredActiveUsers.map((user, index) => {
                        const roleInfo = getRoleLabel(user.user_role);
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#8DC63F]/10 text-[#8DC63F] font-bold flex items-center justify-center text-sm border border-[#8DC63F]/20">
                                  {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{user.user_name || 'N/A'}</p>
                                  <p className="text-xs text-gray-500">{user.user_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleInfo.bg}`}>
                                {roleInfo.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {user.centre_name || 'Global / N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-xs font-mono">
                              {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="font-medium">No active users logged in within the last 24 hours</p>
                  {searchTerm && <p className="text-xs mt-1">Try clearing your search term.</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
