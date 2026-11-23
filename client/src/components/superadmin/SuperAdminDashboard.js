import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  FolderKanban,
  AlertTriangle,
  ShieldAlert,
  Server,
  Database,
  Cpu,
  Wifi,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  HardDrive,
  BarChart3,
  Gauge,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ChevronDown,
  FileDown
} from 'lucide-react';
import SuperAdminStatsAPI, { 
  getSystemHealthAPI,
  getSystemHealthHistoryAPI,
  getSecurityAlertsAPI,
  handleSecurityAlertActionAPI,
  getInstitutionRankingsAPI,
  getSystemMaintenanceAPI,
  exportReportAPI
} from '../../API/SuperAdminStatsAPI';
import { getActivityStatistics } from '../../API/ActivityTrackingAPI';
import getDashboardAPI from '../../API/dashboardAPI';
import { getSocket } from '../../utils/socket';
import { useNavigate } from 'react-router-dom';
import HistoricalHealthChart from './HistoricalHealthChart';
import SecurityAlertModal from './SecurityAlertModal';
import InstitutionDetailModal from './InstitutionDetailModal';
import ExportReportsModal from './ExportReportsModal';
import SystemMaintenanceCard from './SystemMaintenanceCard';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [buttonOpen, setButtonOpen] = useState(true);
  const handleButtonOpen = () => setButtonOpen(!buttonOpen);

  const [dashboardState, setDashboardState] = useState('dashboard'); // 'dashboard' | 'activities' | 'users'
  const [analyticsSubTab, setAnalyticsSubTab] = useState('institutions'); // 'institutions' | 'courses' | 'students' | 'instructors'
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30days'); // 'today' | '7days' | '30days' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({
    institutions: 0,
    students: 0,
    instructors: 0,
    courses: 0,
    activeUsers: 0,
  });

  // VR & Volume Analytics State
  const [vrAnalytics, setVrAnalytics] = useState({
    totalVrAttempts: 0,
    vrCompleted: 0,
    practiceAttempts: 0,
    imageInterpretations: 0,
    completionRate: 85
  });

  const [volumeAnalytics, setVolumeAnalytics] = useState({
    totalVolumes: 0,
    convertedVolumes: 0,
    pendingConversions: 0,
    placedVolumes: 0,
    conversionRate: 100
  });

  // System Health State
  const [systemHealth, setSystemHealth] = useState({
    api: { status: 'Operational', latency: 15, uptimeSeconds: 3600, nodeVersion: 'v20+' },
    database: { status: 'Connected', latencyMs: 12, pool: 'Healthy' },
    backgroundProcessing: { status: 'Operational', realtimeSocket: 'Live Broadcast Active' },
    checkedAt: new Date().toISOString()
  });
  const [healthTesting, setHealthTesting] = useState(false);

  // System Alerts State
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [alertFilter, setAlertFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING'

  // Feature 1: Historical Health State
  const [healthRange, setHealthRange] = useState('today');
  const [healthHistoryData, setHealthHistoryData] = useState(null);
  const [loadingHealthHistory, setLoadingHealthHistory] = useState(false);

  // Feature 2: Security Monitoring State
  const [securityAlertsList, setSecurityAlertsList] = useState([]);
  const [securityAlertsSummary, setSecurityAlertsSummary] = useState({
    critical: 0,
    warning: 0,
    informational: 0,
    total: 0,
    active: 0,
    acknowledged: 0,
    resolved: 0,
    repeatedFailedUsersCount: 0
  });
  const [securitySeverityFilter, setSecuritySeverityFilter] = useState('ALL');
  const [securitySearchTerm, setSecuritySearchTerm] = useState('');
  const [selectedSecurityAlert, setSelectedSecurityAlert] = useState(null);
  const [isActioningAlert, setIsActioningAlert] = useState(false);

  // Feature 3: Institution Rankings State
  const [institutionRankingsList, setInstitutionRankingsList] = useState([]);
  const [institutionSearchTerm, setInstitutionSearchTerm] = useState('');
  const [institutionFilterTier, setInstitutionFilterTier] = useState('ALL');
  const [institutionSortBy, setInstitutionSortBy] = useState('rank');
  const [institutionSortOrder, setInstitutionSortOrder] = useState('asc');
  const [selectedInstitutionDetail, setSelectedInstitutionDetail] = useState(null);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  // Feature 4: System Maintenance State
  const [systemMaintenanceData, setSystemMaintenanceData] = useState(null);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);

  // Feature 5: Automated Reports State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // UI Improvements: Central Event Feed filters & pagination
  const [eventFeedDateFilter, setEventFeedDateFilter] = useState('all');
  const [eventFeedPage, setEventFeedPage] = useState(1);
  const eventFeedPerPage = 10;

  // UI Improvements: Global Audit Stream tab pagination
  const [auditStreamPage, setAuditStreamPage] = useState(1);
  const auditStreamPerPage = 15;

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
  const [recentActivitiesList, setRecentActivitiesList] = useState([]);
  const [activityFilterRole, setActivityFilterRole] = useState('ALL');
  const [activityFilterModule, setActivityFilterModule] = useState('ALL');
  const [activityFilterStatus, setActivityFilterStatus] = useState('ALL');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);

  // Growth & Trends State
  const [trends, setTrends] = useState({
    newStudents30d: 0,
    newInstructors30d: 0,
    newInstitutions30d: 0,
    newCourses30d: 0
  });
  const [topInstructorsList, setTopInstructorsList] = useState([]);

  // Fetch Activity Statistics with Date Filter
  const fetchActivityData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const params = { dateFilter };
      if (dateFilter === 'custom' && customStartDate && customEndDate) {
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      }
      const res = await getActivityStatistics(params);
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
      if (showLoading) setIsRefreshing(false);
      setLastRefreshedAt(new Date());
    }
  }, [dateFilter, customStartDate, customEndDate]);

  // Fetch System Health
  const fetchHealth = useCallback(async () => {
    try {
      const res = await getSystemHealthAPI();
      const healthData = res?.data?.data || res?.data;
      if (healthData) {
        setSystemHealth(healthData);
      }
    } catch {
      // Fallback: estimate latency
      const start = Date.now();
      try {
        await SuperAdminStatsAPI();
        const lat = Date.now() - start;
        setSystemHealth((prev) => ({
          ...prev,
          api: { ...prev.api, latency: lat, status: 'Operational' },
          database: { ...prev.database, latencyMs: Math.max(5, Math.round(lat / 2)), status: 'Connected' },
          checkedAt: new Date().toISOString()
        }));
      } catch {
        setSystemHealth((prev) => ({
          ...prev,
          api: { ...prev.api, status: 'Degraded' },
          database: { ...prev.database, status: 'Degraded' },
          checkedAt: new Date().toISOString()
        }));
      }
    }
  }, []);

  // Feature 1: Historical Health Fetch
  const fetchHealthHistory = useCallback(async (selectedRange = healthRange) => {
    setLoadingHealthHistory(true);
    try {
      const res = await getSystemHealthHistoryAPI({ range: selectedRange });
      const data = res?.data?.data || res?.data;
      if (data) setHealthHistoryData(data);
    } catch (err) {
      console.debug('Failed to fetch health history:', err.message);
    } finally {
      setLoadingHealthHistory(false);
    }
  }, [healthRange]);

  // Feature 2: Security Monitoring Fetch & Actions
  const fetchSecurityAlerts = useCallback(async () => {
    try {
      const res = await getSecurityAlertsAPI({
        severity: securitySeverityFilter,
        search: securitySearchTerm,
        limit: 50
      });
      const data = res?.data?.data || res?.data;
      if (data) {
        setSecurityAlertsList(data.alerts || []);
        if (data.summary) setSecurityAlertsSummary(data.summary);
      }
    } catch (err) {
      console.debug('Failed to fetch security alerts:', err.message);
    }
  }, [securitySeverityFilter, securitySearchTerm]);

  const handleAcknowledgeAlert = async (alertId, notes) => {
    setIsActioningAlert(true);
    try {
      await handleSecurityAlertActionAPI(alertId, { action: 'ACKNOWLEDGE', notes });
      setSelectedSecurityAlert(null);
      fetchSecurityAlerts();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setIsActioningAlert(false);
    }
  };

  const handleResolveAlert = async (alertId, notes) => {
    setIsActioningAlert(true);
    try {
      await handleSecurityAlertActionAPI(alertId, { action: 'RESOLVE', notes });
      setSelectedSecurityAlert(null);
      fetchSecurityAlerts();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setIsActioningAlert(false);
    }
  };

  // Feature 3: Institution Rankings Fetch
  const fetchInstitutionRankings = useCallback(async () => {
    setLoadingInstitutions(true);
    try {
      const res = await getInstitutionRankingsAPI({
        search: institutionSearchTerm,
        filter: institutionFilterTier,
        sortBy: institutionSortBy,
        order: institutionSortOrder
      });
      const data = res?.data?.data || res?.data;
      if (data) {
        setInstitutionRankingsList(data.institutions || []);
      }
    } catch (err) {
      console.debug('Failed to fetch institution rankings:', err.message);
    } finally {
      setLoadingInstitutions(false);
    }
  }, [institutionSearchTerm, institutionFilterTier, institutionSortBy, institutionSortOrder]);

  // Feature 4: System Maintenance Fetch
  const fetchSystemMaintenance = useCallback(async () => {
    setLoadingMaintenance(true);
    try {
      const res = await getSystemMaintenanceAPI();
      const data = res?.data?.data || res?.data;
      if (data) setSystemMaintenanceData(data);
    } catch (err) {
      console.debug('Failed to fetch system maintenance:', err.message);
    } finally {
      setLoadingMaintenance(false);
    }
  }, []);

  // Filter triggers
  useEffect(() => {
    fetchHealthHistory(healthRange);
  }, [healthRange, fetchHealthHistory]);

  useEffect(() => {
    fetchSecurityAlerts();
  }, [securitySeverityFilter, securitySearchTerm, fetchSecurityAlerts]);

  useEffect(() => {
    fetchInstitutionRankings();
  }, [institutionSearchTerm, institutionFilterTier, institutionSortBy, institutionSortOrder, fetchInstitutionRankings]);

  // Fetch Dashboard Core Metrics
  const fetchDashboardStats = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const params = { dateFilter };
      if (dateFilter === 'custom' && customStartDate && customEndDate) {
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      }

      let response = await SuperAdminStatsAPI(params);
      let payload = response?.data?.data || response?.data;

      if (!payload || (payload.institutions == null && !payload.superAdminMetrics)) {
        response = await getDashboardAPI();
        payload = response?.data?.data || response?.data;
      }

      if (payload) {
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

        if (payload.vrAnalytics) setVrAnalytics(payload.vrAnalytics);
        if (payload.volumeAnalytics) setVolumeAnalytics(payload.volumeAnalytics);
        if (payload.systemAlerts) setSystemAlerts(payload.systemAlerts);
        if (payload.trends) setTrends(payload.trends);
        if (payload.topInstructors) setTopInstructorsList(payload.topInstructors);
        if (payload.systemHealth) setSystemHealth(payload.systemHealth);

        if (payload.globalActivityStats) {
          setActivityStats(payload.globalActivityStats);
          if (payload.globalActivityStats.recentActivities) {
            setRecentActivitiesList(payload.globalActivityStats.recentActivities);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching superadmin stats:', err);
    } finally {
      if (showLoading) setIsRefreshing(false);
      setLastRefreshedAt(new Date());
    }
  }, [dateFilter, customStartDate, customEndDate]);

  useEffect(() => {
    let isMounted = true;
    fetchDashboardStats();
    fetchActivityData();
    fetchHealth();
    fetchHealthHistory();
    fetchSecurityAlerts();
    fetchInstitutionRankings();
    fetchSystemMaintenance();

    // Socket.IO real-time stream
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

          // If failed or warning, prepend to alerts
          if (newLog.status === 'FAILED' || String(newLog.action).includes('DELETE') || String(newLog.action).includes('FAIL')) {
            setSystemAlerts((prev) => [newLog, ...prev.filter((i) => i.id !== newLog.id).slice(0, 19)]);
          }

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
            curRoles[mappedRole] = (curRoles[mappedRole] || 0) + 1;

            const breakdown = { ...(prev.actionBreakdown || {}) };
            const act = String(newLog.action || '').toUpperCase();
            const isVR = Boolean(newLog.metadata?.isVR || act.includes('VR'));

            if (act.includes('CREATE_BATCH')) breakdown.batchCreated = (breakdown.batchCreated || 0) + 1;
            if (act.includes('UPDATE_BATCH')) breakdown.batchUpdated = (breakdown.batchUpdated || 0) + 1;
            if (act.includes('CREATE_USER')) breakdown.usersCreated = (breakdown.usersCreated || 0) + 1;
            if (act.includes('UPLOAD_VOLUME')) breakdown.volumesUploaded = (breakdown.volumesUploaded || 0) + 1;
            if (act.includes('ATTEMPT_CHALLENGE')) breakdown.challengesAttempted = (breakdown.challengesAttempted || 0) + 1;
            if (act.includes('COMPLETE_CHALLENGE')) breakdown.challengesCompleted = (breakdown.challengesCompleted || 0) + 1;
            if (act.includes('CERTIFICATE')) breakdown.certificatesGenerated = (breakdown.certificatesGenerated || 0) + 1;
            if (isVR || act.includes('PRACTICE')) breakdown.vrAttempts = (breakdown.vrAttempts || 0) + 1;

            const isSuccess = newLog.status === 'SUCCESS' || !newLog.status;

            return {
              ...prev,
              totalActions: (prev.totalActions || 0) + 1,
              todayActions: (prev.todayActions || 0) + 1,
              successfulActions: isSuccess ? (prev.successfulActions || 0) + 1 : (prev.successfulActions || 0),
              failedActions: !isSuccess ? (prev.failedActions || 0) + 1 : (prev.failedActions || 0),
              roleMap: curRoles,
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

    const pollInterval = setInterval(() => {
      fetchActivityData();
      fetchDashboardStats();
    }, 20000);

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
  }, [fetchDashboardStats, fetchActivityData, fetchHealth]);

  // Role Label Helper
  const getRoleLabel = (role, userId = '') => {
    const r = String(role || '').trim().toLowerCase();
    if (r === '99' || r.includes('super') || r === 'superadmin' || r === 'super admin' || r === 'super_admin') {
      return { text: 'Super Admin', bg: 'bg-purple-100 text-purple-700 border-purple-200' };
    }
    if (r === '101' || r === 'institution_admin' || r === 'institution admin' || (r.includes('admin') && !r.includes('super'))) {
      return { text: 'Admin', bg: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    if (r === '102' || r.includes('instructor') || r.includes('tutor')) {
      return { text: 'Instructor', bg: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
    if (r === '103' || r.includes('trainee') || r.includes('student')) {
      return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    const u = String(userId || '').trim().toLowerCase();
    if (u.includes('super')) return { text: 'Super Admin', bg: 'bg-purple-100 text-purple-700 border-purple-200' };
    if (u.includes('admin')) return { text: 'Admin', bg: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (u.includes('instructor') || u.includes('tutor')) return { text: 'Instructor', bg: 'bg-amber-100 text-amber-700 border-amber-200' };
    if (u.includes('trainee') || u.includes('student')) return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    return { text: 'Trainee', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  // Relative Time Helper
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const secs = Math.floor(diff / 1000);
      if (secs < 60) return `${Math.max(1, secs)}s ago`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;
      return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
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

  const formatUptime = (seconds) => {
    if (!seconds) return '99.98%';
    const hrs = Math.floor(seconds / 3600);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ${hrs % 24}h uptime`;
    return `${hrs}h ${Math.floor((seconds % 3600) / 60)}m uptime`;
  };

  // Run Real-time Ping Latency Test
  const handleTestLatency = async () => {
    setHealthTesting(true);
    const start = Date.now();
    try {
      await fetchHealth();
      const measured = Date.now() - start;
      setSystemHealth((prev) => ({
        ...prev,
        api: { ...prev.api, latency: measured, status: 'Operational' },
        checkedAt: new Date().toISOString()
      }));
    } catch {
      // ignore
    } finally {
      setTimeout(() => setHealthTesting(false), 400);
    }
  };

  // Active Users List
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

  // Role Action Calculations
  const instructorActions = Number(activityStats.roleMap?.['Instructor'] || 0);
  const traineeActions = Number(activityStats.roleMap?.['Trainee'] || 0);
  const adminActions = Number(activityStats.roleMap?.['Admin'] || 0);
  const superAdminActions = Number(activityStats.roleMap?.['Super Admin'] || 0);
  const totalRoleSum = Math.max(instructorActions + traineeActions + adminActions + superAdminActions, 1);

  const instructorPct = Math.round((instructorActions / totalRoleSum) * 100);
  const traineePct = Math.round((traineeActions / totalRoleSum) * 100);
  const adminPct = Math.round((adminActions / totalRoleSum) * 100);
  const superAdminPct = Math.round((superAdminActions / totalRoleSum) * 100);

  // Success Rate Calculation
  const totalSuccess = Number(activityStats.successfulActions || 0);
  const totalFail = Number(activityStats.failedActions || 0);
  const totalActionsRecorded = Math.max(totalSuccess + totalFail, Number(activityStats.totalActions || 1));
  const successRate = Math.min(100, Math.max(0, Math.round((totalSuccess / Math.max(totalActionsRecorded, 1)) * 1000) / 10));

  // Course Distribution calculation
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

  // Platform Growth Points
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

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return recentActivitiesList.filter((act) => {
      const roleObj = getRoleLabel(act.role, act.user_id);
      if (activityFilterRole !== 'ALL' && roleObj.text.toLowerCase() !== activityFilterRole.toLowerCase()) {
        return false;
      }
      if (activityFilterModule !== 'ALL' && act.module !== activityFilterModule) {
        return false;
      }
      if (activityFilterStatus !== 'ALL' && act.status !== activityFilterStatus) {
        return false;
      }
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
  }, [recentActivitiesList, activityFilterRole, activityFilterModule, activityFilterStatus, activitySearchTerm]);

  // Filtered Event Feed Activities (applying eventFeedDateFilter)
  const filteredEventFeedActivities = useMemo(() => {
    const now = Date.now();
    return filteredActivities.filter((act) => {
      if (eventFeedDateFilter === 'all') return true;
      const actTime = new Date(act.created_at).getTime();
      if (isNaN(actTime)) return true;
      const diffMs = now - actTime;
      if (eventFeedDateFilter === 'today') {
        return diffMs <= 24 * 60 * 60 * 1000;
      }
      if (eventFeedDateFilter === '7days') {
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      }
      if (eventFeedDateFilter === '30days') {
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [filteredActivities, eventFeedDateFilter]);

  const totalEventFeedPages = Math.max(1, Math.ceil(filteredEventFeedActivities.length / eventFeedPerPage));
  const paginatedEventFeedActivities = useMemo(() => {
    const start = (eventFeedPage - 1) * eventFeedPerPage;
    return filteredEventFeedActivities.slice(start, start + eventFeedPerPage);
  }, [filteredEventFeedActivities, eventFeedPage, eventFeedPerPage]);

  // Paginated Global Audit Activities
  const totalAuditStreamPages = Math.max(1, Math.ceil(filteredActivities.length / auditStreamPerPage));
  const paginatedAuditActivities = useMemo(() => {
    const start = (auditStreamPage - 1) * auditStreamPerPage;
    return filteredActivities.slice(start, start + auditStreamPerPage);
  }, [filteredActivities, auditStreamPage, auditStreamPerPage]);

  // Filtered System Alerts
  const filteredAlerts = useMemo(() => {
    return systemAlerts.filter((item) => {
      const act = String(item.action || '').toUpperCase();
      const isCritical = item.status === 'FAILED' || act.includes('FAIL') || act.includes('ERROR');
      if (alertFilter === 'CRITICAL' && !isCritical) return false;
      if (alertFilter === 'WARNING' && isCritical) return false;
      return true;
    });
  }, [systemAlerts, alertFilter]);

  // Handle Date Filter Selection
  const handleSelectDateFilter = (filterKey) => {
    setDateFilter(filterKey);
    if (filterKey === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf6]">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white">
        <NavBar />
      </div>

      <div className="flex flex-grow pt-12">
        {/* Sidebar */}
        <div>
          <SideBar handleButtonOpen={handleButtonOpen} buttonOpen={buttonOpen} />
        </div>

        {/* Main Dashboard Canvas */}
        <div
          className={`${
            buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'
          } flex-grow overflow-y-auto bg-[#f8faf6] min-h-[calc(100vh-3rem)] transition-all duration-300`}
        >
          {/* Sub-Header Navigation Tabs & Date Filter Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-[#e5edd8] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Left: View Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              <button
                onClick={() => setDashboardState('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 ${
                  dashboardState === 'dashboard'
                    ? 'bg-[#8DC63F] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={() => setDashboardState('activities')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 ${
                  dashboardState === 'activities'
                    ? 'bg-[#8DC63F] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Zap size={14} />
                <span>Global Audit Stream</span>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
              </button>

              <button
                onClick={() => setDashboardState('users')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 ${
                  dashboardState === 'users'
                    ? 'bg-[#8DC63F] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Activity size={14} />
                <span>Active Users ({activeUsers.length})</span>
              </button>
            </div>

            {/* Right: Date Filter Pills & Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => handleSelectDateFilter('today')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dateFilter === 'today' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => handleSelectDateFilter('7days')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dateFilter === '7days' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => handleSelectDateFilter('30days')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dateFilter === '30days' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => handleSelectDateFilter('custom')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    dateFilter === 'custom' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar size={12} />
                  <span>Custom</span>
                </button>
              </div>

              {/* Live Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{isLive ? 'LIVE' : 'SYNCED'}</span>
              </div>

              {/* Export Reports Button */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                title="Generate and Export Reports"
              >
                <FileDown size={14} className="text-[#8DC63F]" />
                <span className="hidden sm:inline">Export Reports</span>
              </button>

              {/* Last Updated Timestamp */}
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Clock size={12} className="text-slate-400" />
                <span>Updated {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  fetchDashboardStats(true);
                  fetchActivityData(true);
                  fetchHealth();
                  fetchHealthHistory();
                  fetchSecurityAlerts();
                  fetchInstitutionRankings();
                  fetchSystemMaintenance();
                }}
                disabled={isRefreshing}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                title={`Last updated: ${lastRefreshedAt.toLocaleTimeString()}`}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#8DC63F]' : ''} />
              </button>
            </div>
          </div>

          {/* Custom Date Range Picker Drawer (conditionally shown) */}
          {showCustomPicker && (
            <div className="bg-white border-b border-[#e5edd8] px-4 py-2.5 flex items-center gap-3 text-xs animate-in fade-in">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#8DC63F]" />
                Select Date Window:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 border rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 border rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                />
                <button
                  onClick={() => {
                    fetchDashboardStats(true);
                    fetchActivityData(true);
                  }}
                  disabled={!customStartDate || !customEndDate}
                  className="px-3 py-1 bg-[#8DC63F] text-white rounded-lg font-semibold hover:bg-[#7db037] disabled:opacity-50 transition-colors shadow-xs"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {dashboardState === 'dashboard' && (
            <div className="p-4 sm:p-5 flex flex-col gap-5 max-w-[1700px] mx-auto">
              {/* Header Title Card with System Quick Status */}
              <div className="bg-white p-4 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="text-white bg-gradient-to-tr from-[#7ab034] to-[#8DC63F] p-3 rounded-2xl shadow-sm">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Super Admin Dashboard</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Platform analytics, system operations, automated health & security auditing across Project ANU.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />
                    <span className="text-slate-600 font-medium">Scope:</span>
                    <span className="font-bold text-slate-800">All Scan Centers (Global)</span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* 5 ENHANCED KPI SUMMARY CARDS WITH TRENDS & CLICK ACTIONS */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* Card 1: Total Institutions */}
                <div
                  className="group bg-white border border-[#e5edd8] hover:border-[#8DC63F] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate('/academics')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Institutions</span>
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#8DC63F] group-hover:bg-lime-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {stats.institutions}
                    </div>
                    <div className="text-[#8DC63F] bg-lime-50 border border-lime-100 p-2.5 rounded-xl">
                      <Landmark size={24} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <TrendingUp size={12} />
                      +{trends.newInstitutions30d || 2} new (30d)
                    </span>
                    <span className="text-slate-400 font-medium">Accredited centers</span>
                  </div>
                </div>

                {/* Card 2: Total Students */}
                <div
                  className="group bg-white border border-[#e5edd8] hover:border-[#8DC63F] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate('/trainees')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</span>
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#8DC63F] group-hover:bg-lime-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {stats.students}
                    </div>
                    <div className="text-blue-600 bg-blue-50 border border-blue-100 p-2.5 rounded-xl">
                      <GraduationCap size={24} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <TrendingUp size={12} />
                      +{trends.newStudents30d || 0} active
                    </span>
                    <span className="text-slate-400 font-medium">Enrolled trainees</span>
                  </div>
                </div>

                {/* Card 3: Total Instructors */}
                <div
                  className="group bg-white border border-[#e5edd8] hover:border-[#8DC63F] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate('/instructors')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructors</span>
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#8DC63F] group-hover:bg-lime-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {stats.instructors}
                    </div>
                    <div className="text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                      <Presentation size={24} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <TrendingUp size={12} />
                      +{trends.newInstructors30d || 0} certified
                    </span>
                    <span className="text-slate-400 font-medium">Facilitators</span>
                  </div>
                </div>

                {/* Card 4: Total Courses */}
                <div
                  className="group bg-white border border-[#e5edd8] hover:border-[#8DC63F] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate('/certificate')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certifications</span>
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#8DC63F] group-hover:bg-lime-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {stats.courses}
                    </div>
                    <div className="text-purple-600 bg-purple-50 border border-purple-100 p-2.5 rounded-xl">
                      <BookOpen size={24} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <Sparkles size={12} />
                      {courseDistItems.length} categories
                    </span>
                    <span className="text-slate-400 font-medium">Curriculums</span>
                  </div>
                </div>

                {/* Card 5: Active Users (24h) */}
                <div
                  className="group bg-white border border-[#e5edd8] hover:border-[#8DC63F] p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => setDashboardState('users')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users</span>
                    <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-[#8DC63F] group-hover:bg-lime-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {stats.activeUsers}
                    </div>
                    <div className="text-teal-600 bg-teal-50 border border-teal-100 p-2.5 rounded-xl">
                      <Activity size={24} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <Clock size={12} />
                      24h window
                    </span>
                    <span className="text-slate-400 font-medium">Logged in</span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SYSTEM HEALTH MONITORING & SYSTEM ALERTS SECTION */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* System Health Monitoring Card (2 cols) */}
                <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Server size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>System Health & Infrastructure Monitor</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </h3>
                          <p className="text-xs text-slate-400">Live operational diagnostics across server nodes and databases</p>
                        </div>
                      </div>

                      <button
                        onClick={handleTestLatency}
                        disabled={healthTesting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                      >
                        <Wifi size={13} className={healthTesting ? 'animate-spin text-[#8DC63F]' : 'text-slate-500'} />
                        <span>Ping / Test Health</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                      {/* API Gateway */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <Server size={13} className="text-blue-500" /> API Gateway
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-black text-slate-800">{systemHealth.api?.latency || 15} ms</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">{systemHealth.api?.status || 'Operational'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">{formatUptime(systemHealth.api?.uptimeSeconds)}</span>
                      </div>

                      {/* PostgreSQL Database */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <Database size={13} className="text-purple-500" /> PostgreSQL DB
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-black text-slate-800">{systemHealth.database?.latencyMs || 10} ms</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">{systemHealth.database?.status || 'Connected'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Pool: {systemHealth.database?.pool || 'Healthy'}</span>
                      </div>

                      {/* Background Processing & Sockets */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <Cpu size={13} className="text-teal-500" /> WebSockets / BG
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-black text-slate-800">{isLive ? 'Active' : 'Polling'}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">Socket.IO Broadcast</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Live Stream Sync</span>
                      </div>

                      {/* Volume Converter & Storage */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <HardDrive size={13} className="text-amber-500" /> Vol. Pipeline
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-black text-slate-800">{volumeAnalytics.convertedVolumes} Ready</span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">NIfTI/NRRD Converter</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">{volumeAnalytics.pendingConversions} pending</span>
                      </div>
                    </div>

                    {/* Historical Health Performance Trends & Charts */}
                    <HistoricalHealthChart
                      healthHistory={healthHistoryData}
                      range={healthRange}
                      onRangeChange={(newRange) => {
                        setHealthRange(newRange);
                        fetchHealthHistory(newRange);
                      }}
                      onRefresh={() => fetchHealthHistory(healthRange)}
                      loading={loadingHealthHistory}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
                    <span>Target Uptime SLA: <strong className="text-slate-700">99.9%</strong></span>
                    <span>Last diagnostic check: <strong className="text-slate-700">{formatShortTime(systemHealth.checkedAt) || 'Just now'}</strong></span>
                  </div>
                </div>

                {/* System Alerts & Security Audits Card (1 col) */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                          <ShieldAlert size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">System Alerts & Security</h3>
                          <p className="text-xs text-slate-400">Audit triggers, auth alerts & lockout tracking</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          onClick={() => setSecuritySeverityFilter('ALL')}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            securitySeverityFilter === 'ALL' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          All ({securityAlertsSummary.total})
                        </button>
                        <button
                          onClick={() => setSecuritySeverityFilter('CRITICAL')}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            securitySeverityFilter === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          Crit ({securityAlertsSummary.critical})
                        </button>
                        <button
                          onClick={() => setSecuritySeverityFilter('WARNING')}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            securitySeverityFilter === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          Warn ({securityAlertsSummary.warning})
                        </button>
                      </div>
                    </div>

                    {/* Quick Search */}
                    <div className="relative mt-2.5">
                      <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search security alert by user or action..."
                        value={securitySearchTerm}
                        onChange={(e) => setSecuritySearchTerm(e.target.value)}
                        className="w-full pl-7 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                      />
                    </div>

                    {/* Repeated Failed Login Alert Banner */}
                    {securityAlertsSummary.repeatedFailedUsersCount > 0 && (
                      <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                          Repeated Login Failures Detected ({securityAlertsSummary.repeatedFailedUsersCount} account(s))
                        </span>
                      </div>
                    )}

                    {/* Alerts List */}
                    <div className="space-y-2 mt-2.5 overflow-y-auto max-h-[220px] pr-1">
                      {securityAlertsList.length > 0 ? (
                        securityAlertsList.slice(0, 6).map((alert, idx) => {
                          const isFailed = alert.severity === 'CRITICAL';
                          const isWarn = alert.severity === 'WARNING';
                          const isResolved = alert.status === 'RESOLVED';
                          const isAck = alert.status === 'ACKNOWLEDGED';

                          return (
                            <div
                              key={alert.id || idx}
                              className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 transition-all ${
                                isFailed ? 'bg-rose-50/60 border-rose-100' : isWarn ? 'bg-amber-50/60 border-amber-100' : 'bg-slate-50 border-slate-100'
                              }`}
                            >
                              <div className="flex items-start gap-2 overflow-hidden flex-1">
                                <AlertTriangle
                                  size={15}
                                  className={`shrink-0 mt-0.5 ${isFailed ? 'text-rose-600' : isWarn ? 'text-amber-600' : 'text-blue-600'}`}
                                />
                                <div className="truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-800 truncate font-mono text-[11px]">
                                      {alert.title || alert.action}
                                    </span>
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                      isResolved ? 'bg-emerald-100 text-emerald-800' : isAck ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {alert.status}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                                    {alert.user_id ? `User: ${alert.user_id}` : 'System event'} in {alert.module}
                                  </span>
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setSelectedSecurityAlert(alert)}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white"
                                  title="View Full Audit Details"
                                >
                                  <Eye size={13} />
                                </button>
                                {!isResolved && (
                                  <>
                                    {!isAck && (
                                      <button
                                        onClick={() => handleAcknowledgeAlert(alert.id)}
                                        className="p-1 rounded-md text-blue-600 hover:bg-blue-100"
                                        title="Acknowledge Alert"
                                      >
                                        <Check size={13} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleResolveAlert(alert.id)}
                                      className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100"
                                      title="Mark Resolved"
                                    >
                                      <CheckCircle size={13} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-slate-400 text-xs">
                          <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500" />
                          <p className="font-semibold text-slate-700">All systems secure</p>
                          <p className="text-[10px] mt-0.5">Zero security alerts matching current filters</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">
                      {securityAlertsSummary.resolved} alert(s) resolved
                    </span>
                    <button
                      onClick={() => setDashboardState('activities')}
                      className="font-bold text-[#8DC63F] hover:underline text-xs"
                    >
                      Audit Full Security Logs →
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* INTERACTIVE CHARTS: ROLE-WISE ACTIVITY & SUCCESS/FAIL */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 1: Role-Wise Activity Distribution */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                          <BarChart3 size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">Role-Wise Activity Distribution</h3>
                          <p className="text-xs text-slate-400">Total volume breakdown by user category ({totalRoleSum.toLocaleString()} actions)</p>
                        </div>
                      </div>
                    </div>

                    {/* Multi-segment Interactive Stacked Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                        <span>Platform Distribution</span>
                        <span>100% Total Share</span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${instructorPct}%` }}
                          className="bg-amber-500 h-full transition-all duration-500 hover:opacity-90"
                          title={`Instructor: ${instructorActions.toLocaleString()} (${instructorPct}%)`}
                        />
                        <div
                          style={{ width: `${traineePct}%` }}
                          className="bg-teal-500 h-full transition-all duration-500 hover:opacity-90"
                          title={`Trainee: ${traineeActions.toLocaleString()} (${traineePct}%)`}
                        />
                        <div
                          style={{ width: `${adminPct}%` }}
                          className="bg-blue-500 h-full transition-all duration-500 hover:opacity-90"
                          title={`Admin: ${adminActions.toLocaleString()} (${adminPct}%)`}
                        />
                        <div
                          style={{ width: `${superAdminPct}%` }}
                          className="bg-purple-500 h-full transition-all duration-500 hover:opacity-90"
                          title={`Super Admin: ${superAdminActions.toLocaleString()} (${superAdminPct}%)`}
                        />
                      </div>
                    </div>

                    {/* Detailed Role Breakdown Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      {/* Instructor */}
                      <div className="bg-amber-50/50 border border-amber-100/70 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Instructor</span>
                        </div>
                        <span className="text-xl font-black text-amber-950 mt-1 block">
                          {instructorActions.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">{instructorPct}% share</span>
                      </div>

                      {/* Trainee */}
                      <div className="bg-teal-50/50 border border-teal-100/70 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          <span>Trainee</span>
                        </div>
                        <span className="text-xl font-black text-teal-950 mt-1 block">
                          {traineeActions.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block">{traineePct}% share</span>
                      </div>

                      {/* Admin */}
                      <div className="bg-blue-50/50 border border-blue-100/70 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>Admin</span>
                        </div>
                        <span className="text-xl font-black text-blue-950 mt-1 block">
                          {adminActions.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">{adminPct}% share</span>
                      </div>

                      {/* Super Admin */}
                      <div className="bg-purple-50/50 border border-purple-100/70 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>Super Admin</span>
                        </div>
                        <span className="text-xl font-black text-purple-950 mt-1 block">
                          {superAdminActions.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">{superAdminPct}% share</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
                    <span>Calculated dynamically across active user sessions</span>
                    <button onClick={() => setDashboardState('activities')} className="text-[#8DC63F] font-semibold hover:underline">
                      Explore detailed user logs →
                    </button>
                  </div>
                </div>

                {/* Chart 2: Successful vs Failed Actions */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Gauge size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">Success vs. Failure Performance</h3>
                          <p className="text-xs text-slate-400">Reliability & exception rate across API calls</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold">
                        <CheckCircle size={13} />
                        <span>{successRate}% Success</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                      {/* Success Card */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600" /> Successful Actions
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {successRate}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-3xl font-black text-emerald-950">
                            {totalSuccess.toLocaleString()}
                          </span>
                          <span className="text-xs text-emerald-600 font-medium block mt-0.5">Executed without error</span>
                        </div>
                        <div className="w-full bg-emerald-200/60 rounded-full h-2 mt-3">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${successRate}%` }} />
                        </div>
                      </div>

                      {/* Failed Card */}
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                            <XCircle size={16} className="text-rose-600" /> Failed / Exceptions
                          </span>
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            {(100 - successRate).toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-3xl font-black text-rose-950">
                            {totalFail.toLocaleString()}
                          </span>
                          <span className="text-xs text-rose-600 font-medium block mt-0.5">Required attention or rollback</span>
                        </div>
                        <div className="w-full bg-rose-200/60 rounded-full h-2 mt-3">
                          <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.min(100, (100 - successRate))}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
                    <span>Monitored in real-time across API middleware</span>
                    <span className="text-slate-600 font-medium">Reliability index: <strong>Optimal</strong></span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* VR PERFORMANCE & VOLUME CONVERSION ANALYTICS SECTION */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* VR Performance Analytics Hub */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                          <Video size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">VR Simulation & Performance Analytics</h3>
                          <p className="text-xs text-slate-400">Ultrasound simulator engagements, attempts & completions</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                        {vrAnalytics.completionRate}% Completion
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Total VR Attempts</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(vrAnalytics.totalVrAttempts || activityStats.actionBreakdown?.vrAttempts || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block">Simulations launched</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">VR Completed</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(vrAnalytics.vrCompleted || activityStats.actionBreakdown?.challengesCompleted || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Full mastery</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Practice Tests</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(vrAnalytics.practiceAttempts || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">Guided sessions</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Image Interpretation</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(vrAnalytics.imageInterpretations || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Measurements</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Supported Devices: <strong className="text-slate-700">Meta Quest 2/3, Pro & Web Simulator</strong></span>
                    <button onClick={() => navigate('/vrspace')} className="text-[#8DC63F] font-semibold hover:underline">
                      View VR Space Streams →
                    </button>
                  </div>
                </div>

                {/* Volume Conversion Analytics Hub */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-lime-50 text-[#8DC63F] border border-lime-100">
                          <HardDrive size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">3D Volume Conversion & Storage Pipeline</h3>
                          <p className="text-xs text-slate-400">Processing raw ultrasound scans into volumetric formats</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-lime-100 text-lime-800">
                        {volumeAnalytics.conversionRate}% Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Total Uploaded</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(volumeAnalytics.totalVolumes || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">Raw 3D scan files</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Converted (NIfTI)</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(volumeAnalytics.convertedVolumes || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Render-ready</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Pending Queue</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(volumeAnalytics.pendingConversions || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">Processing</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="text-[11px] font-semibold text-slate-500 block">Placed in VR</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">
                          {Number(volumeAnalytics.placedVolumes || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">Curriculum mapped</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Automated conversion worker: <strong className="text-slate-700">Healthy & Idle</strong></span>
                    <button onClick={() => navigate('/volume-management')} className="text-[#8DC63F] font-semibold hover:underline">
                      Manage Volumes →
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* FEATURE 4: SYSTEM MAINTENANCE & BACKUP MONITORING */}
              {/* ======================================================== */}
              <SystemMaintenanceCard
                maintenanceData={systemMaintenanceData}
                loading={loadingMaintenance}
                onRefresh={fetchSystemMaintenance}
              />

              {/* ======================================================== */}
              {/* INSTITUTION, COURSE, STUDENT & INSTRUCTOR ANALYTICS */}
              {/* ======================================================== */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Layers size={18} className="text-[#8DC63F]" />
                      Deep Analytics Hub
                    </h3>
                    <p className="text-xs text-slate-400">Explore institution performance, course distribution, student leaders & instructors</p>
                  </div>

                  {/* Sub-Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setAnalyticsSubTab('institutions')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsSubTab === 'institutions' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Institutions
                    </button>
                    <button
                      onClick={() => setAnalyticsSubTab('courses')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsSubTab === 'courses' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Courses & Approvals
                    </button>
                    <button
                      onClick={() => setAnalyticsSubTab('students')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsSubTab === 'students' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Top Students
                    </button>
                    <button
                      onClick={() => setAnalyticsSubTab('instructors')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsSubTab === 'instructors' ? 'bg-[#8DC63F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Instructors
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Sub-Tab 1: Institution Performance Ranking (Feature 3) */}
                  {analyticsSubTab === 'institutions' && (
                    <div className="space-y-3">
                      {/* Search, Filter Tier, and Sort Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        {/* Search Institution */}
                        <div className="relative flex-1">
                          <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search institution by name, email, code..."
                            value={institutionSearchTerm}
                            onChange={(e) => setInstitutionSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                          />
                        </div>

                        {/* Tier Filters */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                          <button
                            onClick={() => setInstitutionFilterTier('ALL')}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              institutionFilterTier === 'ALL' ? 'bg-[#8DC63F] text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            All ({institutionRankingsList.length})
                          </button>
                          <button
                            onClick={() => setInstitutionFilterTier('TOP')}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              institutionFilterTier === 'TOP' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Top-Performing ({institutionRankingsList.filter(i => i.tier === 'Top Performing').length})
                          </button>
                          <button
                            onClick={() => setInstitutionFilterTier('ATTENTION')}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              institutionFilterTier === 'ATTENTION' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Requires Attention ({institutionRankingsList.filter(i => i.tier === 'Requires Attention').length})
                          </button>
                        </div>

                        {/* Sorting Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort:</span>
                          <select
                            value={institutionSortBy}
                            onChange={(e) => setInstitutionSortBy(e.target.value)}
                            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                          >
                            <option value="rank">Rank / Score</option>
                            <option value="name">Name</option>
                            <option value="total_trainees">Enrolled Trainees</option>
                            <option value="active_trainees">Active Trainees</option>
                            <option value="completion_rate">Completion Rate</option>
                            <option value="status">Status</option>
                          </select>
                          <button
                            onClick={() => setInstitutionSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                            title={`Order: ${institutionSortOrder.toUpperCase()}`}
                          >
                            {institutionSortOrder === 'asc' ? '↑' : '↓'}
                          </button>
                        </div>
                      </div>

                      {/* Ranked Institutions Table */}
                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b">
                              <th className="py-3 px-3">Rank</th>
                              <th className="py-3 px-3">Institution / Scan Center</th>
                              <th className="py-3 px-3">Trainees (Total / Active)</th>
                              <th className="py-3 px-3">Course Completion</th>
                              <th className="py-3 px-3">VR Training Performance</th>
                              <th className="py-3 px-3">Status & Tier</th>
                              <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {institutionRankingsList.length > 0 ? (
                              institutionRankingsList.map((item, idx) => {
                                const rank = item.rank || (idx + 1);
                                const isTop = item.tier === 'Top Performing';
                                const isAttention = item.tier === 'Requires Attention';

                                return (
                                  <tr key={item.center_id || idx} className="hover:bg-slate-50/70 transition-colors">
                                    {/* Rank badge */}
                                    <td className="py-3 px-3">
                                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                        rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                        rank === 2 ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                                        rank === 3 ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                                        'bg-slate-100 text-slate-600'
                                      }`}>
                                        #{rank}
                                      </span>
                                    </td>

                                    {/* Institution Name */}
                                    <td className="py-3 px-3 font-semibold text-slate-800">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-lime-50 text-[#8DC63F] flex items-center justify-center font-bold shrink-0">
                                          <Landmark size={14} />
                                        </div>
                                        <div>
                                          <span className="block font-bold text-slate-900">{item.name}</span>
                                          <span className="text-[10px] text-slate-400 font-mono block">
                                            {item.email || `ID: ${item.center_id}`}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Trainees count */}
                                    <td className="py-3 px-3 text-slate-700 font-mono">
                                      <span className="font-bold text-slate-900">{Number(item.total_trainees || 0).toLocaleString()}</span>
                                      <span className="text-slate-400 text-[10px] ml-1">enrolled</span>
                                      <span className="text-emerald-600 text-[10px] font-bold block">
                                        • {Number(item.active_trainees || 0).toLocaleString()} active (30d)
                                      </span>
                                    </td>

                                    {/* Completion Rate */}
                                    <td className="py-3 px-3">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-slate-800 text-xs">
                                          {item.completion_rate || 0}%
                                        </span>
                                      </div>
                                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                                        <div 
                                          className={`h-1.5 rounded-full ${
                                            (item.completion_rate || 0) >= 60 ? 'bg-[#8DC63F]' :
                                            (item.completion_rate || 0) >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                          }`}
                                          style={{ width: `${Math.min(100, item.completion_rate || 0)}%` }}
                                        />
                                      </div>
                                    </td>

                                    {/* VR Training Performance */}
                                    <td className="py-3 px-3 font-mono">
                                      <span className="font-bold text-slate-800">
                                        {Number(item.vr_attempts || 0).toLocaleString()}
                                      </span>
                                      <span className="text-[10px] text-purple-600 block font-sans">VR exercises</span>
                                    </td>

                                    {/* Status & Tier */}
                                    <td className="py-3 px-3">
                                      <div className="flex flex-col gap-1 items-start">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          isTop ? 'bg-emerald-100 text-emerald-800' :
                                          isAttention ? 'bg-rose-100 text-rose-800' :
                                          'bg-slate-100 text-slate-700'
                                        }`}>
                                          {item.tier || 'Good Standing'}
                                        </span>
                                        <span className={`text-[10px] font-semibold ${
                                          item.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>
                                          ● {item.status}
                                        </span>
                                      </div>
                                    </td>

                                    {/* Action buttons */}
                                    <td className="py-3 px-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => setSelectedInstitutionDetail(item)}
                                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                                        >
                                          View Details
                                        </button>
                                        <button
                                          onClick={() => navigate('/academics')}
                                          className="text-xs font-semibold text-[#8DC63F] hover:underline whitespace-nowrap"
                                        >
                                          Manage →
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                                  {loadingInstitutions ? 'Loading institution rankings...' : 'No institutions found matching your search or filter criteria.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 2: Courses & Approvals */}
                  {analyticsSubTab === 'courses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Distribution */}
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">Course Categories</h4>
                        <div className="flex items-center justify-around gap-4">
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
                              <span className="text-sm font-black text-slate-800">{stats.courses}</span>
                              <span className="text-[10px] text-slate-400">Total</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 text-xs text-slate-600">
                            {courseDistItems.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-sm ${item.bgColor}`} />
                                <span className="font-semibold text-slate-800">{item.category}</span>
                                <span className="text-slate-400 font-mono">({item.count} - {item.pct}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Approval Queue */}
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 overflow-y-auto max-h-[160px]">
                        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Recent Course Statuses</h4>
                        <table className="w-full text-left text-xs">
                          <tbody className="divide-y divide-slate-100">
                            {(dashboardData?.courseApprovals || []).slice(0, 5).map((item, idx) => (
                              <tr key={idx} className="hover:bg-white/60">
                                <td className="py-2 font-medium text-slate-800 truncate max-w-[130px]">{item.course_name}</td>
                                <td className="py-2 text-slate-400 truncate max-w-[100px]">{item.institution}</td>
                                <td className="py-2 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                  )}

                  {/* Sub-Tab 3: Top Students */}
                  {analyticsSubTab === 'students' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b">
                            <th className="py-3 px-3">Trainee / Student</th>
                            <th className="py-3 px-3">Email Identifier</th>
                            <th className="py-3 px-3">Completed Modules</th>
                            <th className="py-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(dashboardData?.TopPerformingTraineesGlobal || []).map((student, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                  {student.user_name?.charAt(0) || 'S'}
                                </div>
                                <span>{student.user_name}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-mono">{student.user_email}</td>
                              <td className="py-3 px-3">
                                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-100 font-mono">
                                  {student.completed_count} certifications
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button onClick={() => navigate('/trainees')} className="text-xs font-semibold text-[#8DC63F] hover:underline">
                                  Inspect Profile →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Sub-Tab 4: Instructors */}
                  {analyticsSubTab === 'instructors' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b">
                            <th className="py-3 px-3">Instructor Name</th>
                            <th className="py-3 px-3">Email Address</th>
                            <th className="py-3 px-3">Assigned Center</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(topInstructorsList.length > 0 ? topInstructorsList : (dashboardData?.topInstructors || [])).map((inst, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                                  {inst.user_name?.charAt(0) || 'I'}
                                </div>
                                <span>{inst.user_name}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-mono">{inst.user_email}</td>
                              <td className="py-3 px-3 text-slate-600 font-medium">{inst.centre_name || 'Main Campus'}</td>
                              <td className="py-3 px-3">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {inst.status || 'Active'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button onClick={() => navigate('/instructors')} className="text-xs font-semibold text-[#8DC63F] hover:underline">
                                  Manage Instructor →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* RECENT ACTIVITIES SECTION WITH SEARCH & ROLE FILTERS */}
              {/* ======================================================== */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5edd8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-lime-50 text-[#8DC63F] border border-lime-100">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">Live Central Event Feed</h3>
                        <p className="text-xs text-slate-400">Stream of user operations across Project ANU ({recentActivitiesList.length} loaded)</p>
                      </div>
                    </div>

                    {/* Search & Role Quick Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search action or user..."
                          value={activitySearchTerm}
                          onChange={(e) => setActivitySearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8DC63F] w-48 sm:w-60"
                        />
                      </div>

                      <select
                        value={activityFilterRole}
                        onChange={(e) => setActivityFilterRole(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                      >
                        <option value="ALL">All Roles</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Trainee">Trainee</option>
                      </select>

                      <select
                        value={activityFilterStatus}
                        onChange={(e) => {
                          setActivityFilterStatus(e.target.value);
                          setEventFeedPage(1);
                        }}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                      >
                        <option value="ALL">All Status</option>
                        <option value="SUCCESS">Success Only</option>
                        <option value="FAILED">Failed Only</option>
                      </select>

                      <select
                        value={eventFeedDateFilter}
                        onChange={(e) => {
                          setEventFeedDateFilter(e.target.value);
                          setEventFeedPage(1);
                        }}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8DC63F]"
                        title="Filter live feed by timeframe"
                      >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Activity Items List */}
                  <div className="space-y-2 mt-4 overflow-y-auto max-h-[320px] pr-1">
                    {paginatedEventFeedActivities.length > 0 ? (
                      paginatedEventFeedActivities.map((act, idx) => {
                        const roleInfo = getRoleLabel(act.role, act.user_id);
                        const isFail = act.status === 'FAILED';
                        const timeStr = formatRelativeTime(act.created_at);

                        return (
                          <div
                            key={act.id || idx}
                            className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-[#8DC63F] rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0 min-w-[55px]">
                                {timeStr}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border ${roleInfo.bg}`}>
                                {roleInfo.text}
                              </span>
                              <div className="truncate">
                                <p className="font-semibold text-slate-800 truncate" title={act.description || act.action}>
                                  {act.description || `${roleInfo.text} performed ${act.action}`}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {act.user_id} • {act.module}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                                isFail ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {isFail ? <X size={10} /> : <Check size={10} />}
                                {act.status || 'SUCCESS'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        <Clock size={24} className="mx-auto mb-1 text-slate-300" />
                        No activities match your current search and role filters.
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls for Event Feed */}
                  {filteredEventFeedActivities.length > eventFeedPerPage && (
                    <div className="flex items-center justify-between pt-3 px-1 text-xs text-slate-500 border-t border-slate-100 mt-2">
                      <span>
                        Showing {Math.min((eventFeedPage - 1) * eventFeedPerPage + 1, filteredEventFeedActivities.length)} - {Math.min(eventFeedPage * eventFeedPerPage, filteredEventFeedActivities.length)} of {filteredEventFeedActivities.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEventFeedPage((p) => Math.max(1, p - 1))}
                          disabled={eventFeedPage <= 1}
                          className="px-2 py-1 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold"
                        >
                          Prev
                        </button>
                        <span className="font-semibold text-slate-700">
                          {eventFeedPage} / {totalEventFeedPages}
                        </span>
                        <button
                          onClick={() => setEventFeedPage((p) => Math.min(totalEventFeedPages, p + 1))}
                          disabled={eventFeedPage >= totalEventFeedPages}
                          className="px-2 py-1 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Real-time audit log captured across all scan centers</span>
                  <button
                    onClick={() => setDashboardState('activities')}
                    className="font-bold text-[#8DC63F] hover:underline"
                  >
                    Open Comprehensive Event Audit View ({filteredActivities.length}) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED GLOBAL ACTIVITY AUDIT STREAM */}
          {dashboardState === 'activities' && (
            <div className="p-4 sm:p-6 bg-white m-4 rounded-2xl shadow-xs border border-[#e5edd8] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="text-[#8DC63F]" size={24} />
                      Central Activity Tracking & Event Audit
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Stream Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete chronological audit ledger of all user and system operations across Super Admin, Admin, Instructor, and Trainee spaces.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchActivityData(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#8DC63F]' : ''} />
                    <span>Refresh Ledger</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3">
                  <span className="text-xs font-semibold text-indigo-700">Total Actions</span>
                  <p className="text-2xl font-black text-indigo-950 mt-1">
                    {Number(activityStats.totalActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                  <span className="text-xs font-semibold text-emerald-700">Today's Actions</span>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {Number(activityStats.todayActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3">
                  <span className="text-xs font-semibold text-teal-700">Successful</span>
                  <p className="text-2xl font-black text-teal-950 mt-1">
                    {Number(activityStats.successfulActions || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3">
                  <span className="text-xs font-semibold text-rose-700">Failed / Errors</span>
                  <p className="text-2xl font-black text-rose-950 mt-1">
                    {Number(activityStats.failedActions || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="relative flex-1 w-full">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by action, user, module, description..."
                    value={activitySearchTerm}
                    onChange={(e) => setActivitySearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Role:</span>
                  <select
                    value={activityFilterRole}
                    onChange={(e) => setActivityFilterRole(e.target.value)}
                    className="text-xs bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Trainee">Trainee</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Module:</span>
                  <select
                    value={activityFilterModule}
                    onChange={(e) => setActivityFilterModule(e.target.value)}
                    className="text-xs bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
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

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Status:</span>
                  <select
                    value={activityFilterStatus}
                    onChange={(e) => setActivityFilterStatus(e.target.value)}
                    className="text-xs bg-white border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Success Only</option>
                    <option value="FAILED">Failed Only</option>
                  </select>
                </div>
              </div>

              {/* Activity Log Table */}
              {filteredActivities.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b">
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">User</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Details / Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedAuditActivities.map((act, index) => {
                        const roleInfo = getRoleLabel(act.role, act.user_id);
                        const isSuccess = act.status === 'SUCCESS';
                        const time = new Date(act.created_at).toLocaleString();
                        const displayDesc = act.description
                          ? act.description.replace(/^User\b/i, roleInfo.text)
                          : (act.target_id ? `Target: ${act.target_id}` : '-');

                        return (
                          <tr key={act.id || index} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-slate-500 font-mono whitespace-nowrap">
                              {time}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${roleInfo.bg}`}>
                                {roleInfo.text}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 max-w-[140px] truncate" title={act.user_id}>
                              {act.user_id}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800 font-mono">
                              {act.action}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                {act.module}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 w-fit ${
                                isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isSuccess ? <Check size={12} /> : <X size={12} />}
                                {act.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate" title={displayDesc}>
                              {displayDesc}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Tab 2 Audit Stream Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600">
                    <div>
                      Showing <span className="font-bold">{Math.min((auditStreamPage - 1) * auditStreamPerPage + 1, filteredActivities.length)}</span> to{' '}
                      <span className="font-bold">{Math.min(auditStreamPage * auditStreamPerPage, filteredActivities.length)}</span> of{' '}
                      <span className="font-bold">{filteredActivities.length}</span> audit events
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAuditStreamPage((p) => Math.max(1, p - 1))}
                        disabled={auditStreamPage <= 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white font-semibold text-xs transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-2 font-bold text-slate-800">
                        Page {auditStreamPage} of {totalAuditStreamPages}
                      </span>
                      <button
                        onClick={() => setAuditStreamPage((p) => Math.min(totalAuditStreamPages, p + 1))}
                        disabled={auditStreamPage >= totalAuditStreamPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white font-semibold text-xs transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed">
                  <Zap className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="font-semibold text-slate-700">No activity events found matching your criteria</p>
                  <p className="text-xs text-slate-400 mt-1">Actions performed on any dashboard will automatically record and appear here in real-time.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTIVE USERS (24H) */}
          {dashboardState === 'users' && (
            <div className="p-4 sm:p-6 bg-white m-4 rounded-2xl shadow-xs border border-[#e5edd8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-[#8DC63F]" size={24} />
                    Active Platform Users (Last 24 Hours)
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Users logged in during the past 24 hours ({activeUsers.length} total active users recorded)
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by name, email, center..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
                  />
                </div>
              </div>

              {filteredActiveUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Scan Center / Institution</th>
                        <th className="py-3 px-4">Last Activity Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredActiveUsers.map((user, index) => {
                        const roleInfo = getRoleLabel(user.user_role);
                        return (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#8DC63F]/10 text-[#8DC63F] font-bold flex items-center justify-center text-sm border border-[#8DC63F]/20">
                                  {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{user.user_name || 'N/A'}</p>
                                  <p className="text-xs text-slate-500">{user.user_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${roleInfo.bg}`}>
                                {roleInfo.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {user.centre_name || 'Global / N/A'}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                              {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="mx-auto mb-2 text-slate-400" size={32} />
                  <p className="font-medium">No active users logged in within the last 24 hours</p>
                  {searchTerm && <p className="text-xs mt-1">Try clearing your search term.</p>}
                </div>
              )}
            </div>
          )}

          {/* Modals for Super Admin Dashboard Enhancements */}
          <SecurityAlertModal
            alert={selectedSecurityAlert}
            onClose={() => setSelectedSecurityAlert(null)}
            onAcknowledge={handleAcknowledgeAlert}
            onResolve={handleResolveAlert}
            isActioning={isActioningAlert}
          />

          <InstitutionDetailModal
            institution={selectedInstitutionDetail}
            onClose={() => setSelectedInstitutionDetail(null)}
          />

          <ExportReportsModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            currentDateFilter={dateFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
