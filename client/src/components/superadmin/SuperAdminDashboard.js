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
  NotepadText,
  Zap,
  Radio,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  Search,
  Sparkles,
  Layers,
  Award,
  Video,
  FileCheck2,
  FolderKanban
} from 'lucide-react';
import GetScanCentersAPI from '../../API/GetScanCentersAPI';
import GetCoursesAPI from '../../API/GetCoursesAPI';
import GetIntructorsAPI from '../../API/GetIntructorsAPI';
import TraineeListAPI from '../../API/TraineeListAPI';
import UserStatsAPI from '../../API/UserStatsAPI';
import getDashboardAPI from '../../API/dashboardAPI';
import SuperAdminStatsAPI from '../../API/SuperAdminStatsAPI';
import { getActivityStatistics } from '../../API/ActivityTrackingAPI';
import { getSocket } from '../../utils/socket';
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

  // Global Activity Tracking State
  const [activityStats, setActivityStats] = useState({
    totalActions: 0,
    todayActions: 0,
    weekActions: 0,
    monthActions: 0,
    successfulActions: 0,
    failedActions: 0,
    actionBreakdown: {
      batchCreated: 0,
      batchUpdated: 0,
      usersCreated: 0,
      volumesUploaded: 0,
      challengesAttempted: 0,
      challengesCompleted: 0,
      certificatesGenerated: 0,
      vrAttempts: 0,
    },
    byRole: [],
    roleMap: { Instructor: 0, Trainee: 0, Admin: 0, 'Super Admin': 0 },
    byModule: [],
    byAction: [],
    trendOverTime: [],
    recentActivities: []
  });
  const [isLive, setIsLive] = useState(false);
  const [isRefreshingActivities, setIsRefreshingActivities] = useState(false);
  const [recentActivitiesList, setRecentActivitiesList] = useState([]);
  const [activityFilterRole, setActivityFilterRole] = useState('ALL');
  const [activityFilterModule, setActivityFilterModule] = useState('ALL');
  const [activityFilterStatus, setActivityFilterStatus] = useState('ALL');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');

  const fetchActivityData = async (showLoading = false) => {
    if (showLoading) setIsRefreshingActivities(true);
    try {
      const res = await getActivityStatistics();
      const data = res?.data?.data || res?.data;
      if (data) {
        setActivityStats((prev) => ({
          ...prev,
          ...data,
          actionBreakdown: data.actionBreakdown || prev.actionBreakdown,
          roleMap: data.roleMap || prev.roleMap
        }));
        if (Array.isArray(data.recentActivities) && data.recentActivities.length > 0) {
          setRecentActivitiesList(data.recentActivities);
        }
      }
    } catch (err) {
      console.debug('Activity stats fetch notice:', err.message);
    } finally {
      if (showLoading) setIsRefreshingActivities(false);
    }
  };

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

          // If activity stats bundled in payload
          if (payload.globalActivityStats) {
            setActivityStats(payload.globalActivityStats);
            if (payload.globalActivityStats.recentActivities) {
              setRecentActivitiesList(payload.globalActivityStats.recentActivities);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching superadmin stats:', err);
      }
    };

    fetchDashboardStats();
    fetchActivityData();

    // Socket.IO real-time updates
    let socket;
    try {
      socket = getSocket();
      if (socket) {
        if (socket.connected) setIsLive(true);
        socket.on('connect', () => setIsLive(true));
        socket.on('disconnect', () => setIsLive(false));

        socket.on('activity:new', (newLog) => {
          setIsLive(true);
          if (newLog?.action && (String(newLog.action).includes('LOGIN') || String(newLog.action).includes('VR'))) {
            fetchDashboardStats();
          }
          setRecentActivitiesList((prev) => [newLog, ...prev.filter((i) => i.id !== newLog.id).slice(0, 49)]);
          setActivityStats((prev) => {
            const rawRole = String(newLog.role || '').toLowerCase();
            let mappedRole = newLog.role || 'User';
            if (rawRole === '103' || rawRole.includes('trainee') || rawRole.includes('student') || newLog.metadata?.isVR) {
              mappedRole = 'Trainee';
            } else if (rawRole === '102' || rawRole.includes('instructor') || rawRole.includes('tutor')) {
              mappedRole = 'Instructor';
            } else if (rawRole === '101' || (rawRole.includes('admin') && !rawRole.includes('super'))) {
              mappedRole = 'Admin';
            } else if (rawRole === '99' || rawRole.includes('super')) {
              mappedRole = 'Super Admin';
            }

            const curRoles = { ...(prev.roleMap || {}) };
            if (curRoles[mappedRole] !== undefined) {
              curRoles[mappedRole] = (curRoles[mappedRole] || 0) + 1;
            } else if (mappedRole in curRoles) {
              curRoles[mappedRole] = 1;
            } else if (newLog.metadata?.isVR) {
              curRoles['Trainee'] = (curRoles['Trainee'] || 0) + 1;
            }

            const breakdown = { ...(prev.actionBreakdown || {}) };
            const act = String(newLog.action || '').toUpperCase();
            const mod = String(newLog.module || '').toUpperCase();
            const isVR = Boolean(newLog.metadata?.isVR || act.includes('VR') || mod.includes('VR'));

            if (act.includes('CREATE_BATCH') || act.includes('BATCH_CREATED')) breakdown.batchCreated = (breakdown.batchCreated || 0) + 1;
            if (act.includes('UPDATE_BATCH') || act.includes('BATCH_UPDATED')) breakdown.batchUpdated = (breakdown.batchUpdated || 0) + 1;
            if (act.includes('CREATE_USER') || act.includes('USER_CREATED')) breakdown.usersCreated = (breakdown.usersCreated || 0) + 1;
            if (act.includes('UPLOAD_VOLUME') || act.includes('VOLUME_UPLOADED')) breakdown.volumesUploaded = (breakdown.volumesUploaded || 0) + 1;
            if (act.includes('ATTEMPT_CHALLENGE')) breakdown.challengesAttempted = (breakdown.challengesAttempted || 0) + 1;
            if (act.includes('COMPLETE_CHALLENGE')) breakdown.challengesCompleted = (breakdown.challengesCompleted || 0) + 1;
            if (act.includes('CERTIFICATE')) breakdown.certificatesGenerated = (breakdown.certificatesGenerated || 0) + 1;
            if (isVR || act.includes('PRACTICE')) breakdown.vrAttempts = (breakdown.vrAttempts || 0) + 1;

            // Dynamically update byModule in real-time
            const curModules = [...(prev.byModule || [])];
            const modName = newLog.module || (isVR ? 'VR Modules' : 'General');
            const mIdx = curModules.findIndex((m) => m.module === modName);
            if (mIdx >= 0) {
              curModules[mIdx] = { ...curModules[mIdx], count: Number(curModules[mIdx].count || 0) + 1 };
            } else {
              curModules.unshift({ module: modName, count: 1 });
            }

            const isSuccess = newLog.status === 'SUCCESS' || !newLog.status;

            return {
              ...prev,
              totalActions: (prev.totalActions || 0) + 1,
              todayActions: (prev.todayActions || 0) + 1,
              successfulActions: isSuccess ? (prev.successfulActions || 0) + 1 : (prev.successfulActions || 0),
              failedActions: !isSuccess ? (prev.failedActions || 0) + 1 : (prev.failedActions || 0),
              roleMap: curRoles,
              byModule: curModules,
              actionBreakdown: breakdown
            };
          });
        });

        socket.on('stats:update', (updatedStats) => {
          if (updatedStats) {
            setActivityStats((prev) => ({
              ...prev,
              ...updatedStats,
              roleMap: updatedStats.roleMap || prev.roleMap,
              actionBreakdown: updatedStats.actionBreakdown || prev.actionBreakdown
            }));
            if (Array.isArray(updatedStats.recentActivities) && updatedStats.recentActivities.length > 0) {
              setRecentActivitiesList(updatedStats.recentActivities);
            }
          }
        });
      }
    } catch (e) {
      console.debug('Socket error:', e.message);
    }

    // Polling fallback to keep numbers synchronized
    const pollInterval = setInterval(() => {
      fetchActivityData();
      fetchDashboardStats();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('activity:new');
        socket.off('stats:update');
      }
    };
  }, []);

  const getRoleLabel = (role, userId = '') => {
    const r = String(role || '').trim().toLowerCase();
    if (r === '99' || r.includes('super') || r === 'superadmin' || r === 'super admin' || r === 'super_admin') {
      return { text: 'Super Admin', bg: 'bg-purple-100 text-purple-700' };
    }
    if (r === '101' || r === 'institution_admin' || r === 'institution admin' || (r.includes('admin') && !r.includes('super'))) {
      return { text: 'Admin', bg: 'bg-blue-100 text-blue-700' };
    }
    if (r === '102' || r.includes('instructor') || r.includes('tutor')) {
      return { text: 'Instructor', bg: 'bg-amber-100 text-amber-700' };
    }
    if (r === '103' || r.includes('trainee') || r.includes('student')) {
      return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700' };
    }

    // Contextual lookup from user identifier / email
    const u = String(userId || '').trim().toLowerCase();
    if (u.includes('super')) return { text: 'Super Admin', bg: 'bg-purple-100 text-purple-700' };
    if (u.includes('admin')) return { text: 'Admin', bg: 'bg-blue-100 text-blue-700' };
    if (u.includes('instructor') || u.includes('tutor')) return { text: 'Instructor', bg: 'bg-amber-100 text-amber-700' };
    if (u.includes('trainee') || u.includes('student')) return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700' };

    return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700' };
  };

  const formatShortTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
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

  // Role Action Calculations for Progress Bars
  const instructorActions = Number(activityStats.roleMap?.['Instructor'] || 0);
  const traineeActions = Number(activityStats.roleMap?.['Trainee'] || 0);
  const adminActions = Number(activityStats.roleMap?.['Admin'] || 0);
  const superAdminActions = Number(activityStats.roleMap?.['Super Admin'] || 0);
  const totalRoleSum = Math.max(instructorActions + traineeActions + adminActions + superAdminActions, 1);

  // Filtered Activities
  const filteredActivities = recentActivitiesList.filter((act) => {
    const roleObj = getRoleLabel(act.role, act.user_id);
    if (activityFilterRole !== 'ALL') {
      if (roleObj.text.toLowerCase() !== activityFilterRole.toLowerCase()) return false;
    }
    if (activityFilterModule !== 'ALL' && act.module !== activityFilterModule) return false;
    if (activityFilterStatus !== 'ALL' && act.status !== activityFilterStatus) return false;
    if (activitySearchTerm) {
      const q = activitySearchTerm.toLowerCase();
      return (
        act.action?.toLowerCase().includes(q) ||
        act.module?.toLowerCase().includes(q) ||
        act.role?.toLowerCase().includes(q) ||
        roleObj.text.toLowerCase().includes(q) ||
        act.user_id?.toLowerCase().includes(q) ||
        act.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
          <div className="text-gray-500 bg-white px-3 py-2 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDashboardState('dashboard')}
                className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer font-semibold transition-all ease-in-out duration-200 ${
                  dashboardState === 'dashboard'
                    ? 'bg-[#8DC63F] text-white shadow-sm'
                    : 'hover:bg-gray-100 hover:text-[#8DC63F]'
                }`}
              >
                <LayoutDashboard size={14} />
                <span className="text-[13px]">Overview</span>
              </button>

              <button
                onClick={() => setDashboardState('activities')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-all duration-200 ease-in-out font-semibold ${
                  dashboardState === 'activities'
                    ? 'bg-[#8DC63F] text-white shadow-sm'
                    : 'hover:bg-gray-100 hover:text-[#8DC63F]'
                }`}
              >
                <Zap size={14} />
                <span className="text-[13px]">Global Activity Tracking</span>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
              </button>

              <button
                onClick={() => setDashboardState('users')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-all duration-200 ease-in-out font-semibold ${
                  dashboardState === 'users'
                    ? 'bg-[#8DC63F] text-white shadow-sm'
                    : 'hover:bg-gray-100 hover:text-[#8DC63F]'
                }`}
              >
                <Activity size={14} />
                <span className="text-[13px]">Active Users (24h)</span>
              </button>
            </div>

            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold">{isLive ? 'LIVE Real-Time Stream' : 'Live Sync Active'}</span>
              </div>
              <button
                onClick={() => fetchActivityData(true)}
                disabled={isRefreshingActivities}
                className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100 transition-colors"
                title="Refresh Activity Stats"
              >
                <RefreshCw size={14} className={isRefreshingActivities ? 'animate-spin text-[#8DC63F]' : ''} />
              </button>
            </div>
          </div>

          {/* Tab 1: Overview */}
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
                    <p className="text-xs text-gray-500">Global control center & central action tracking across Project ANU</p>
                  </div>
                </div>
              </div>

              {/* 5 Standard KPI Cards Section */}
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

              {/* ======================================================== */}
              {/* GLOBAL ACTIVITY STATISTICS & ACTION TRACKING COMMAND CARD */}
              {/* ======================================================== */}
              <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900 tracking-tight">GLOBAL ACTIVITY STATISTICS</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                          Live Monitor
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Every action performed in any dashboard is centrally captured and reflected here</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDashboardState('activities')}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Detailed Audit View</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Top Action Metrics Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div className="bg-gradient-to-br from-indigo-50/70 to-indigo-100/40 border border-indigo-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">Total Actions</span>
                    <span className="text-2xl font-black text-indigo-900 mt-1 block">
                      {Number(activityStats.totalActions || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-medium mt-0.5 block">Lifetime recorded</span>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Today's Actions</span>
                    <span className="text-2xl font-black text-emerald-900 mt-1 block">
                      {Number(activityStats.todayActions || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Past 24 hours</span>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50/70 to-amber-100/40 border border-amber-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Instructor Actions</span>
                    <span className="text-2xl font-black text-amber-900 mt-1 block">
                      {instructorActions.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">Tutors & trainers</span>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50/70 to-teal-100/40 border border-teal-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">Trainee Actions</span>
                    <span className="text-2xl font-black text-teal-900 mt-1 block">
                      {traineeActions.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-teal-600 font-medium mt-0.5 block">Students & learners</span>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50/70 to-blue-100/40 border border-blue-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Admin Actions</span>
                    <span className="text-2xl font-black text-blue-900 mt-1 block">
                      {adminActions.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Institution admins</span>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50/70 to-purple-100/40 border border-purple-100 p-3 rounded-lg">
                    <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">Super Admin</span>
                    <span className="text-2xl font-black text-purple-900 mt-1 block">
                      {superAdminActions.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-purple-600 font-medium mt-0.5 block">Platform operators</span>
                  </div>
                </div>

                {/* Middle Grid: Activity by Role & Activity by Module */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left: Activity by Dashboard / Role */}
                  <div className="border rounded-lg p-3.5 bg-gray-50/60 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Users size={14} className="text-emerald-600" />
                          Activity by Dashboard / Role
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">Total: {totalRoleSum.toLocaleString()}</span>
                      </div>

                      <div className="space-y-3">
                        {/* Instructor */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              Instructor
                            </span>
                            <span className="font-mono text-gray-900">{instructorActions.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((instructorActions / totalRoleSum) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Trainee */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                              Trainee
                            </span>
                            <span className="font-mono text-gray-900">{traineeActions.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((traineeActions / totalRoleSum) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Admin */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              Admin
                            </span>
                            <span className="font-mono text-gray-900">{adminActions.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((adminActions / totalRoleSum) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Super Admin */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                              Super Admin
                            </span>
                            <span className="font-mono text-gray-900">{superAdminActions.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((superAdminActions / totalRoleSum) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t text-[11px] text-gray-500 mt-2">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 size={13} />
                        {Number(activityStats.successfulActions || 0).toLocaleString()} Successful
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <XCircle size={13} />
                        {Number(activityStats.failedActions || 0).toLocaleString()} Failed
                      </span>
                    </div>
                  </div>

                  {/* Right: Activity by Module */}
                  <div className="border rounded-lg p-3.5 bg-gray-50/60 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers size={14} className="text-emerald-600" />
                          Activity by Module
                        </span>
                        <span className="text-[11px] text-gray-400">Captured in real-time</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {(activityStats.byModule && activityStats.byModule.length > 0) ? (
                          activityStats.byModule.slice(0, 6).map((mod, i) => (
                            <div key={i} className="bg-white border rounded p-2 flex justify-between items-center shadow-xs">
                              <span className="font-medium text-gray-700 truncate pr-1">{mod.module}</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number(mod.count).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">VR Modules</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number(activityStats.actionBreakdown?.vrAttempts || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">Challenges</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number((activityStats.actionBreakdown?.challengesAttempted || 0) + (activityStats.actionBreakdown?.challengesCompleted || 0)).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">Batch Management</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number((activityStats.actionBreakdown?.batchCreated || 0) + (activityStats.actionBreakdown?.batchUpdated || 0)).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">User Management</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number(activityStats.actionBreakdown?.usersCreated || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">Certificates & Courses</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number(activityStats.actionBreakdown?.certificatesGenerated || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white border rounded p-2 flex justify-between items-center">
                              <span className="font-medium text-gray-700">Volume Management</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {Number(activityStats.actionBreakdown?.volumesUploaded || 0).toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 pt-3 border-t mt-2 flex justify-between">
                      <span>Actions tracked across all application dashboards</span>
                      <span className="text-[#8DC63F] font-semibold cursor-pointer" onClick={() => setDashboardState('activities')}>
                        View all modules →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Grid: 8 Specific Statistics Counters & Live Recent Activities Stream */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                  {/* Left: 8 Specific Action Counters */}
                  <div className="border rounded-lg p-3.5 bg-gray-50/60">
                    <span className="font-bold text-xs text-gray-700 uppercase tracking-wider block mb-2.5">
                      Key Action Statistics
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Batch Created</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.batchCreated || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Batch Updated</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.batchUpdated || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Users Created</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.usersCreated || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Volumes Uploaded</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.volumesUploaded || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Challenges Att.</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.challengesAttempted || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Challenges Comp.</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.challengesCompleted || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">Certificates Gen.</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.certificatesGenerated || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border rounded-lg p-2.5 text-center shadow-xs">
                        <span className="text-[11px] text-gray-500 block truncate">VR Attempts</span>
                        <span className="text-xl font-bold text-gray-800 mt-1 block">
                          {Number(activityStats.actionBreakdown?.vrAttempts || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Recent Activities Stream */}
                  <div className="border rounded-lg p-3.5 bg-gray-50/60 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock size={14} className="text-emerald-600" />
                          Recent Activities Stream
                        </span>
                        <button
                          onClick={() => setDashboardState('activities')}
                          className="text-[11px] text-[#8DC63F] font-semibold hover:underline"
                        >
                          View Log ({recentActivitiesList.length})
                        </button>
                      </div>

                      <div className="space-y-1.5 overflow-y-auto max-h-[175px] pr-1">
                        {recentActivitiesList.length > 0 ? (
                          recentActivitiesList.slice(0, 5).map((act, idx) => {
                            const roleInfo = getRoleLabel(act.role, act.user_id);
                            const timeStr = formatShortTime(act.created_at);
                            const isFail = act.status === 'FAILED';

                            return (
                              <div
                                key={act.id || idx}
                                className="bg-white border rounded-lg p-2 text-xs flex items-center justify-between gap-2 shadow-xs hover:border-[#8DC63F] transition-all"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <span className="text-[10px] font-mono text-gray-400 shrink-0 font-medium">
                                    {timeStr || 'now'}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${roleInfo.bg}`}>
                                    {roleInfo.text}
                                  </span>
                                  <p className="text-gray-800 font-medium truncate" title={act.description || act.action}>
                                    {act.description ? act.description.replace(/^User\b/i, roleInfo.text) : `${roleInfo.text} performed ${act.action}`}
                                  </p>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                                  isFail ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {act.status}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-6 text-gray-400 text-xs">
                            <Clock size={20} className="mx-auto mb-1 text-gray-300" />
                            No recent activities yet. Actions performed in any dashboard will appear here in real-time.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Panels Section Below */}
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

          {/* Tab 2: Dedicated Global Activity Tracking & Audit Stream */}
          {dashboardState === 'activities' && (
            <div className="p-4 sm:p-6 bg-white m-4 rounded-xl shadow-sm border space-y-5">
              {/* Header Title with Live Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="text-[#8DC63F]" size={24} />
                      Central Activity Tracking & Event Audit
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Stream
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete central event log of all actions across Super Admin, Admin, Instructor, and Trainee dashboards.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchActivityData(true)}
                    disabled={isRefreshingActivities}
                    className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={13} className={isRefreshingActivities ? 'animate-spin text-[#8DC63F]' : ''} />
                    <span>Refresh Now</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Stat Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3">
                  <span className="text-xs font-semibold text-indigo-700">Total Actions</span>
                  <p className="text-2xl font-black text-indigo-950 mt-1">
                    {Number(activityStats.totalActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3">
                  <span className="text-xs font-semibold text-emerald-700">Today's Actions</span>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {Number(activityStats.todayActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-teal-50/60 border border-teal-100 rounded-lg p-3">
                  <span className="text-xs font-semibold text-teal-700">Successful</span>
                  <p className="text-2xl font-black text-teal-950 mt-1">
                    {Number(activityStats.successfulActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 rounded-lg p-3">
                  <span className="text-xs font-semibold text-rose-700">Failed / Errors</span>
                  <p className="text-2xl font-black text-rose-950 mt-1">
                    {Number(activityStats.failedActions || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by action, user, module, description..."
                    value={activitySearchTerm}
                    onChange={(e) => setActivitySearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  />
                </div>

                {/* Filter by Role */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Role:</span>
                  <select
                    value={activityFilterRole}
                    onChange={(e) => setActivityFilterRole(e.target.value)}
                    className="text-xs bg-white border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Trainee">Trainee</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                {/* Filter by Module */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Module:</span>
                  <select
                    value={activityFilterModule}
                    onChange={(e) => setActivityFilterModule(e.target.value)}
                    className="text-xs bg-white border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  >
                    <option value="ALL">All Modules</option>
                    <option value="Batch Management">Batch Management</option>
                    <option value="User Management">User Management</option>
                    <option value="Volume Management">Volume Management</option>
                    <option value="VR Modules">VR Modules</option>
                    <option value="Challenge Modules">Challenge Modules</option>
                    <option value="Course Modules">Course Modules</option>
                    <option value="Targeted Learning">Targeted Learning</option>
                    <option value="Assessment Modules">Assessment Modules</option>
                  </select>
                </div>

                {/* Filter by Status */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Status:</span>
                  <select
                    value={activityFilterStatus}
                    onChange={(e) => setActivityFilterStatus(e.target.value)}
                    className="text-xs bg-white border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Success Only</option>
                    <option value="FAILED">Failed Only</option>
                  </select>
                </div>
              </div>

              {/* Activity Log Table */}
              {filteredActivities.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b">
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">User</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Details / Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredActivities.map((act, index) => {
                        const roleInfo = getRoleLabel(act.role, act.user_id);
                        const isSuccess = act.status === 'SUCCESS';
                        const time = new Date(act.created_at).toLocaleString();
                        const displayDesc = act.description
                          ? act.description.replace(/^User\b/i, roleInfo.text)
                          : (act.target_id ? `Target: ${act.target_id}` : '-');

                        return (
                          <tr key={act.id || index} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-gray-500 font-mono whitespace-nowrap">
                              {time}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${roleInfo.bg}`}>
                                {roleInfo.text}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-gray-700 max-w-[140px] truncate" title={act.user_id}>
                              {act.user_id}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-gray-800 font-mono">
                              {act.action}
                            </td>
                            <td className="py-2.5 px-3 text-gray-600">
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                                {act.module}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-fit ${
                                isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isSuccess ? <Check size={12} /> : <X size={12} />}
                                {act.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-600 max-w-[200px] truncate" title={displayDesc}>
                              {displayDesc}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed">
                  <Zap className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="font-semibold text-gray-700">No activity events found matching your criteria</p>
                  <p className="text-xs text-gray-400 mt-1">Actions performed on any dashboard will automatically record and appear here in real-time.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Active Users (24h) */}
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
