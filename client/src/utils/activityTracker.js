import { trackAction } from '../API/ActivityTrackingAPI';
import { jwtDecode } from 'jwt-decode';

export const TRACKED_MODULES = Object.freeze({
  BATCH_MANAGEMENT: 'Batch Management',
  USER_MANAGEMENT: 'User Management',
  VOLUME_MANAGEMENT: 'Volume Management',
  VR_MODULES: 'VR Modules',
  CHALLENGE_MODULES: 'Challenge Modules',
  CERTIFICATES: 'Certificates',
  COURSE_MODULES: 'Course Modules',
  TARGETED_LEARNING: 'Targeted Learning',
  ASSESSMENTS: 'Assessment Modules',
  MINDSPARK: 'MindSpark Modules',
  INSTITUTIONS: 'Institutions',
  QUERIES: 'Queries'
});

export const TRACKED_ACTIONS = Object.freeze({
  // Batches
  CREATE_BATCH: 'CREATE_BATCH',
  UPDATE_BATCH: 'UPDATE_BATCH',
  DELETE_BATCH: 'DELETE_BATCH',
  ASSOCIATE_BATCH: 'ASSOCIATE_BATCH',

  // Users
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  DISABLE_USER: 'DISABLE_USER',

  // Volumes
  UPLOAD_VOLUME: 'UPLOAD_VOLUME',
  UPDATE_VOLUME: 'UPDATE_VOLUME',
  APPROVE_VOLUME: 'APPROVE_VOLUME',
  ASSOCIATE_VOLUME: 'ASSOCIATE_VOLUME',

  // VR
  START_VR_TEST: 'START_VR_TEST',
  END_VR_TEST: 'END_VR_TEST',
  VR_ATTEMPT_STARTED: 'VR_ATTEMPT_STARTED',
  VR_ATTEMPT_COMPLETED: 'VR_ATTEMPT_COMPLETED',
  SUBMIT_VR_MEASUREMENT: 'SUBMIT_VR_MEASUREMENT',
  PRACTICE_ATTEMPT: 'PRACTICE_ATTEMPT',
  SAVE_VR_RECORDING: 'SAVE_VR_RECORDING',

  // Challenges
  ATTEMPT_CHALLENGE: 'ATTEMPT_CHALLENGE',
  COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',

  // Courses & Certificates
  CREATE_COURSE: 'CREATE_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
  CREATE_CURRICULUM: 'CREATE_CURRICULUM',
  DELETE_CURRICULUM: 'DELETE_CURRICULUM',
  CREATE_MODULE: 'CREATE_MODULE',
  COMPLETE_MODULE: 'COMPLETE_MODULE',
  CERTIFICATE_GENERATED: 'CERTIFICATE_GENERATED',

  // Targeted Learning
  CREATE_TARGETED_LEARNING: 'CREATE_TARGETED_LEARNING',
  DELETE_TARGETED_LEARNING: 'DELETE_TARGETED_LEARNING',

  // Scan Centers
  CREATE_SCAN_CENTER: 'CREATE_SCAN_CENTER',

  // Mindspark & Tests
  ATTEMPT_TEST: 'ATTEMPT_TEST',
  COMPLETE_TEST: 'COMPLETE_TEST',
  SUBMIT_MINDSPARK: 'SUBMIT_MINDSPARK'
});

/**
 * Reusable Centralized Activity Tracking Method
 */
export const trackActivity = async ({
  action,
  module = 'General',
  targetType = null,
  targetId = null,
  status = 'SUCCESS',
  metadata = {},
  userId = null,
  role = null
}) => {
  try {
    if (!action) {
      console.warn('[ActivityTracker] action parameter is required');
      return null;
    }

    let resolvedUserId = userId;
    let resolvedRole = role;

    // Resolve user email and role from local storage token if not provided
    if (!resolvedUserId || !resolvedRole) {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('user_token') : null;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded) {
            if (!resolvedUserId) resolvedUserId = decoded.user_mail || decoded.id;
            if (!resolvedRole) resolvedRole = decoded.role;
          }
        } catch (_) {}
      }
    }

    const isVrStored = typeof localStorage !== 'undefined' && localStorage.getItem('isVr') === 'true';
    const payload = {
      action,
      module: isVrStored && (!module || module === 'General') ? 'VR Modules' : module,
      targetType,
      targetId,
      status: status?.toUpperCase() === 'FAILED' ? 'FAILED' : 'SUCCESS',
      metadata: {
        ...(metadata || {}),
        ...(isVrStored ? { isVR: true, device: localStorage.getItem('device') || 'VR Headset' } : {})
      },
      userId: resolvedUserId,
      role: resolvedRole
    };

    const response = await trackAction(payload);
    return response?.data;
  } catch (err) {
    console.debug('[ActivityTracker] tracking dispatched, background response:', err.message);
    return null;
  }
};

/**
 * Extract clean, human-readable label for any interactive element
 */
const getButtonLabel = (el) => {
  if (!el) return 'Button';
  const dataAction = el.getAttribute('data-action') || el.getAttribute('data-name');
  if (dataAction) return dataAction.trim();

  const aria = el.getAttribute('aria-label') || el.getAttribute('title');
  if (aria) return aria.trim();

  const text = (el.innerText || el.textContent || '').trim();
  if (text && text.length <= 40 && !text.includes('\n')) {
    return text;
  }
  if (text && text.length > 0) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length <= 40) return firstLine;
  }

  if (el.value && typeof el.value === 'string' && el.value.trim().length <= 30) {
    return el.value.trim();
  }

  const img = el.querySelector('img');
  if (img && img.alt) return img.alt.trim();

  if (el.id && el.id.length <= 30) return el.id.replace(/[-_]/g, ' ');
  if (el.name && el.name.length <= 30) return el.name.replace(/[-_]/g, ' ');

  return 'Action Button';
};

/**
 * Determine current module from window path and user role
 */
const getModuleFromPath = (path, role) => {
  const p = (path || '').toLowerCase();
  if (p.includes('/dashboard')) {
    if (role === 'Super Admin') return 'Super Admin Dashboard';
    if (role === 'Admin') return 'Admin Dashboard';
    if (role === 'Instructor') return 'Instructor Dashboard';
    if (role === 'Trainee') return 'Trainee Dashboard';
    return 'Dashboard';
  }
  if (p.includes('/batch')) return 'Batch Management';
  if (p.includes('/trainee') || p.includes('/instructors')) return 'User Management';
  if (p.includes('/curriculum') || p.includes('/certificate') || p.includes('/course')) return 'Course Modules';
  if (p.includes('/mylearning') || p.includes('/learning')) return 'My Learning';
  if (p.includes('/progress')) return 'Progress';
  if (p.includes('/academics')) return 'Academics';
  if (p.includes('/stream')) return 'Streaming';
  if (p.includes('/queries')) return 'Queries';
  if (p.includes('/reports')) return 'Reports';
  if (p.includes('/volume')) return 'Volume Management';
  if (p.includes('/sessions')) return 'Sessions';
  return 'General';
};

/**
 * Resolves current logged-in user credentials and normalized role
 */
const getCurrentUserAndRole = () => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('user_token') : null;
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded) {
        let role = 'User';
        const r = String(decoded.role || '').trim().toLowerCase();
        if (r === '99' || r.includes('super')) role = 'Super Admin';
        else if (r === '101' || r.includes('admin')) role = 'Admin';
        else if (r === '102' || r.includes('instructor')) role = 'Instructor';
        else if (r === '103' || r.includes('trainee') || r.includes('student')) role = 'Trainee';

        return {
          userId: decoded.user_mail || decoded.id || 'system',
          role
        };
      }
    }
  } catch (_) {}
  return { userId: null, role: null };
};

let lastTracked = { key: '', time: 0 };
let isTrackerInitialized = false;

/**
 * Attaches a centralized, non-intrusive global click handler
 * Captures real-time button clicks done by any role (Trainee, Admin, Instructor, Super Admin)
 */
export const initGlobalActivityTracker = () => {
  if (isTrackerInitialized || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const handleGlobalClick = (e) => {
    try {
      const clickable = e.target.closest(
        'button, [role="button"], a, input[type="button"], input[type="submit"], [data-action], .cursor-pointer'
      );
      if (!clickable) return;

      // Skip internal UI components like notifications or elements flagged with data-no-track
      if (clickable.closest('.Toastify') || clickable.getAttribute('data-no-track') === 'true') {
        return;
      }

      const { userId, role } = getCurrentUserAndRole();
      if (!userId || !role) return;

      const label = getButtonLabel(clickable);
      if (!label || (label === 'Action Button' && !clickable.tagName.toLowerCase().match(/button|a|input/))) {
        return;
      }

      const now = Date.now();
      const clickKey = `${label}:${window.location.pathname}`;
      if (lastTracked.key === clickKey && now - lastTracked.time < 400) {
        return; // Debounce duplicate rapid clicks
      }
      lastTracked = { key: clickKey, time: now };

      const isVrStored = typeof localStorage !== 'undefined' && localStorage.getItem('isVr') === 'true';
      const module = isVrStored ? 'VR Modules' : getModuleFromPath(window.location.pathname, role);

      trackActivity({
        action: 'BUTTON_CLICK',
        module,
        targetType: 'button',
        targetId: label,
        metadata: {
          buttonName: label,
          path: window.location.pathname,
          element: clickable.tagName.toLowerCase(),
          device: isVrStored ? (localStorage.getItem('device') || 'VR Headset') : 'Browser',
          isVR: isVrStored
        },
        userId,
        role
      });
    } catch (_) {
      // Non-blocking: never interrupt application flow
    }
  };

  document.addEventListener('click', handleGlobalClick, true);
  isTrackerInitialized = true;
};

export default trackActivity;
