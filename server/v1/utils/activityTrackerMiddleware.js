const jwt = require('jsonwebtoken');
const { trackActivity } = require('../services/activityTrackingService');

/**
 * Route pattern mapping for automatic tracking
 */
const ROUTE_ACTION_MAP = [
  // Batch Management
  { method: 'POST', pattern: /^\/api\/v1\/create-batch/i, action: 'CREATE_BATCH', module: 'Batch Management', targetType: 'batch' },
  { method: 'POST', pattern: /^\/api\/v1\/update-batch/i, action: 'UPDATE_BATCH', module: 'Batch Management', targetType: 'batch' },
  { method: 'PUT', pattern: /^\/api\/v1\/update-batch/i, action: 'UPDATE_BATCH', module: 'Batch Management', targetType: 'batch' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-batch/i, action: 'DELETE_BATCH', module: 'Batch Management', targetType: 'batch' },
  { method: 'POST', pattern: /^\/api\/v1\/associate-batch/i, action: 'ASSOCIATE_BATCH', module: 'Batch Management', targetType: 'batch' },

  // User Management
  { method: 'POST', pattern: /^\/api\/v1\/create-?trainee/i, action: 'CREATE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'POST', pattern: /^\/api\/v1\/update-trainee/i, action: 'UPDATE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'PUT', pattern: /^\/api\/v1\/trainee\/update/i, action: 'UPDATE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-trainee/i, action: 'DELETE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'POST', pattern: /^\/api\/v1\/disable-trainee/i, action: 'DISABLE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'PUT', pattern: /^\/api\/v1\/disable-trainee/i, action: 'DISABLE_USER', module: 'User Management', targetType: 'trainee' },
  { method: 'POST', pattern: /^\/api\/v1\/delete-instructor/i, action: 'DELETE_USER', module: 'User Management', targetType: 'instructor' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-ins/i, action: 'DELETE_USER', module: 'User Management', targetType: 'instructor' },
  { method: 'POST', pattern: /^\/api\/v1\/update-instructor/i, action: 'UPDATE_USER', module: 'User Management', targetType: 'instructor' },
  { method: 'PUT', pattern: /^\/api\/v1\/instructor\/update/i, action: 'UPDATE_USER', module: 'User Management', targetType: 'instructor' },
  { method: 'POST', pattern: /^\/api\/v1\/super-admins/i, action: 'CREATE_USER', module: 'User Management', targetType: 'super_admin' },

  // Volume Management
  { method: 'POST', pattern: /^\/api\/v1\/sv-upload/i, action: 'UPLOAD_VOLUME', module: 'Volume Management', targetType: 'volume' },
  { method: 'PUT', pattern: /^\/api\/v1\/update-volume/i, action: 'UPDATE_VOLUME', module: 'Volume Management', targetType: 'volume' },
  { method: 'POST', pattern: /^\/api\/v1\/volume-approval/i, action: 'APPROVE_VOLUME', module: 'Volume Management', targetType: 'volume' },
  { method: 'PATCH', pattern: /^\/api\/v1\/approve-volume/i, action: 'APPROVE_VOLUME', module: 'Volume Management', targetType: 'volume' },
  { method: 'POST', pattern: /^\/api\/v1\/associate-volume/i, action: 'ASSOCIATE_VOLUME', module: 'Volume Management', targetType: 'volume' },

  // VR Modules
  { method: 'POST', pattern: /^\/api\/v1\/volume-placements?/i, action: 'START_VR_TEST', module: 'VR Modules', targetType: 'vr_placement' },
  { method: 'GET', pattern: /^\/api\/v1\/volume-placements?/i, action: 'VR_VOLUME_DATA', module: 'VR Modules', targetType: 'vr_placement' },
  { method: 'POST', pattern: /^\/api\/v1\/(uploadvolumerecording|volume-recordings?)/i, action: 'SAVE_VR_RECORDING', module: 'VR Modules', targetType: 'vr_recording' },
  { method: 'POST', pattern: /^\/api\/v1\/(start-ii-prac|iivr-start-test)/i, action: 'START_VR_TEST', module: 'VR Modules', targetType: 'vr_test' },
  { method: 'PUT', pattern: /^\/api\/v1\/(end-ii-prac|iivr-end-test)/i, action: 'END_VR_TEST', module: 'VR Modules', targetType: 'vr_test' },
  { method: 'POST', pattern: /^\/api\/v1\/(end-ii-prac|iivr-end-test)/i, action: 'END_VR_TEST', module: 'VR Modules', targetType: 'vr_test' },
  { method: 'POST', pattern: /^\/api\/v1\/(submit-ii|iivr)/i, action: 'SUBMIT_VR_MEASUREMENT', module: 'VR Modules', targetType: 'iivr' },
  { method: 'POST', pattern: /^\/api\/v1\/(practice-i-ii|practice)/i, action: 'PRACTICE_ATTEMPT', module: 'VR Modules', targetType: 'practice' },
  { method: 'POST', pattern: /^\/api\/v1\/(submit-prac-test|prac-test)/i, action: 'PRACTICE_ATTEMPT', module: 'VR Modules', targetType: 'practice_test' },
  { method: 'GET', pattern: /^\/api\/v1\/prac-test-attempt-details/i, action: 'VR_DATA_ACCESS', module: 'VR Modules', targetType: 'practice_test' },
  { method: 'POST', pattern: /^\/api\/v1\/(submit-msob|lrob)/i, action: 'SUBMIT_VR_MEASUREMENT', module: 'VR Modules', targetType: 'msob' },
  { method: 'POST', pattern: /^\/api\/v1\/(streaming\/)?(tokenn|publisher-session\/[^/]+\/activate)/i, action: 'START_VR_STREAM', module: 'VR Modules', targetType: 'vr_stream' },
  { method: 'DELETE', pattern: /^\/api\/v1\/streaming\/publisher-session/i, action: 'END_VR_STREAM', module: 'VR Modules', targetType: 'vr_stream' },
  { method: 'GET', pattern: /^\/api\/v1\/trainee\/[^/]+/i, action: 'VR_SESSION', module: 'VR Modules', targetType: 'vr_session', condition: (req) => req.query?.isVr === 'true' || req.query?.isvr === 'true' || req.deviceInfo?.isVR },
  { method: 'GET', pattern: /^\/api\/v1\/get-vr-data/i, action: 'VR_DATA_ACCESS', module: 'VR Modules', targetType: 'vr_data' },
  { method: 'POST', pattern: /^\/api\/v1\/user-completion/i, action: 'COMPLETE_VR_RESOURCE', module: 'VR Modules', targetType: 'resource' },

  // Challenge Modules
  { method: 'POST', pattern: /^\/api\/v1\/challenges\/submit/i, action: 'COMPLETE_CHALLENGE', module: 'Challenge Modules', targetType: 'challenge' },
  { method: 'GET', pattern: /^\/api\/v1\/challenges\/questions/i, action: 'ATTEMPT_CHALLENGE', module: 'Challenge Modules', targetType: 'challenge' },

  // Assessment Modules
  { method: 'POST', pattern: /^\/api\/v1\/attempt-test/i, action: 'ATTEMPT_TEST', module: 'Assessment Modules', targetType: 'test' },
  { method: 'POST', pattern: /^\/api\/v1\/cal-test-score/i, action: 'COMPLETE_TEST', module: 'Assessment Modules', targetType: 'test' },

  // Course / Curriculum / Certificate Modules
  { method: 'POST', pattern: /^\/api\/v1\/curiculam/i, action: 'CREATE_CURRICULUM', module: 'Course Modules', targetType: 'curriculum' },
  { method: 'POST', pattern: /^\/api\/v1\/curiculum/i, action: 'CREATE_CURRICULUM', module: 'Course Modules', targetType: 'curriculum' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-curiculum/i, action: 'DELETE_CURRICULUM', module: 'Course Modules', targetType: 'curriculum' },
  { method: 'POST', pattern: /^\/api\/v1\/create-course/i, action: 'CREATE_COURSE', module: 'Course Modules', targetType: 'course' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-course/i, action: 'DELETE_COURSE', module: 'Course Modules', targetType: 'course' },
  { method: 'POST', pattern: /^\/api\/v1\/tag-course/i, action: 'TAG_COURSE', module: 'Course Modules', targetType: 'course' },
  { method: 'POST', pattern: /^\/api\/v1\/request-course/i, action: 'REQUEST_COURSE', module: 'Course Modules', targetType: 'course' },
  { method: 'POST', pattern: /^\/api\/v1\/create-module/i, action: 'CREATE_MODULE', module: 'Course Modules', targetType: 'module' },
  { method: 'POST', pattern: /^\/api\/v1\/new-module/i, action: 'CREATE_MODULE', module: 'Course Modules', targetType: 'module' },
  { method: 'POST', pattern: /^\/api\/v1\/sub-module/i, action: 'CREATE_SUB_MODULE', module: 'Course Modules', targetType: 'module' },
  { method: 'POST', pattern: /^\/api\/v1\/module-complete/i, action: 'COMPLETE_MODULE', module: 'Course Modules', targetType: 'module' },
  { method: 'POST', pattern: /^\/api\/v1\/create-resource/i, action: 'CREATE_RESOURCE', module: 'Course Modules', targetType: 'resource' },
  { method: 'POST', pattern: /^\/api\/v1\/create-learning-module/i, action: 'CREATE_LEARNING_MODULE', module: 'Course Modules', targetType: 'learning_module' },
  { method: 'POST', pattern: /^\/api\/v1\/course-mappings/i, action: 'CREATE_COURSE_MAPPING', module: 'Course Modules', targetType: 'course_mapping' },

  // Targeted Learning
  { method: 'POST', pattern: /^\/api\/v1\/create-targeted-learning/i, action: 'CREATE_TARGETED_LEARNING', module: 'Targeted Learning', targetType: 'targeted_learning' },
  { method: 'DELETE', pattern: /^\/api\/v1\/delete-targeted-learning/i, action: 'DELETE_TARGETED_LEARNING', module: 'Targeted Learning', targetType: 'targeted_learning' },

  // Scan Centers / Institutions
  { method: 'POST', pattern: /^\/api\/v1\/createscancenters/i, action: 'CREATE_SCAN_CENTER', module: 'Institutions', targetType: 'scan_center' },
  { method: 'POST', pattern: /^\/api\/v1\/institutions/i, action: 'CREATE_INSTITUTION', module: 'Institutions', targetType: 'institution' },

  // MindSpark
  { method: 'POST', pattern: /^\/api\/v1\/mind-spark/i, action: 'SUBMIT_MINDSPARK', module: 'MindSpark Modules', targetType: 'mindspark' },
  { method: 'POST', pattern: /^\/api\/v1\/questions/i, action: 'SUBMIT_QUESTION', module: 'MindSpark Modules', targetType: 'mindspark' },

  // Queries
  { method: 'POST', pattern: /^\/api\/v1\/queries/i, action: 'CREATE_QUERY', module: 'Queries', targetType: 'query' },

  // Auth Sessions
  { method: 'POST', pattern: /^\/api\/v1\/login/i, action: 'USER_LOGIN', module: 'Authentication', targetType: 'session' }
];

/**
 * Activity Tracker Middleware
 */
const activityTrackerMiddleware = (req, res, next) => {
  const url = req.originalUrl || req.url || '';

  // Explicitly exclude internal and non-dashboard maintenance requests
  if (
    url.includes('/api/v1/activity-logs') ||
    url.includes('/api/v1/super-admin/statistics') ||
    url.includes('/api/v1/super-admin/recent-activities') ||
    url.includes('/api/v1/super-admin/activity-summary') ||
    url.includes('/api/v1/superadmin') ||
    url.includes('/api/v1/refresh-token') ||
    url.includes('/api/v1/sessions') ||
    url.includes('/api/v1/notifications') ||
    url.includes('/socket.io') ||
    url.includes('/health')
  ) {
    return next();
  }

  const isVRRequest = Boolean(
    req.deviceInfo?.isVR ||
    req.query?.isVr === 'true' ||
    req.query?.isvr === 'true' ||
    req.body?.isVr === true ||
    req.body?.isvr === true ||
    req.body?.loginContext === 'vr' ||
    req.headers?.['x-device-type']?.toLowerCase()?.includes('vr') ||
    req.headers?.['x-client']?.toLowerCase()?.includes('vr') ||
    req.headers?.['x-vr-device']
  );

  // Find matching route rule
  const matchedRule = ROUTE_ACTION_MAP.find(
    (rule) => rule.method === req.method && rule.pattern.test(url) && (!rule.condition || rule.condition(req))
  );

  // If not matched, but it's a state-mutating action or request originating from VR, track it
  const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  if (!matchedRule && !isMutating && !isVRRequest) {
    return next();
  }

  // Hook into response completion
  res.on('finish', () => {
    // Only track after the backend operation has finalized
    const statusCode = res.statusCode;
    const isSuccess = statusCode >= 200 && statusCode < 400;
    const status = isSuccess ? 'SUCCESS' : 'FAILED';

    let action, module, targetType;

    if (matchedRule) {
      action = matchedRule.action;
      module = matchedRule.module;
      targetType = matchedRule.targetType;
    } else {
      // Correctly derive action & module dynamically from full original URL (NOT req.baseUrl)
      const cleanPath = url.split('?')[0];
      const parts = cleanPath.split('/').filter(Boolean);
      // Example: '/api/v1/something-new' -> parts: ['api', 'v1', 'something-new']
      const endpointName = parts[parts.length - 1] || 'action';
      if (endpointName === 'v1' || endpointName === 'api') {
        return; // Skip invalid root calls
      }
      action = isVRRequest
        ? `VR_${req.method}_${endpointName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
        : `${req.method}_${endpointName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      module = isVRRequest ? 'VR Modules' : (parts[2] ? parts[2].replace(/[-_]/g, ' ').toUpperCase() : (parts[1] || 'General'));
      targetType = endpointName;
    }

    // Extract user info
    let userId = req.user?.user_mail ||
      req.user?.email ||
      req.body?.user_mail ||
      req.user?.people_id ||
      req.params?.people_id ||
      req.body?.people_id ||
      req.body?.trainee_id ||
      req.query?.people_id ||
      req.query?.trainee_id;
    let rawRole = req.user?.role;

    // Decode from Authorization Bearer token or cookies if req.user is not yet attached
    if (!userId || !rawRole) {
      const authHeader = req.headers?.authorization || '';
      const bearerToken = /^Bearer (.+)$/i.exec(authHeader)?.[1];
      const tokenToDecode = bearerToken || req.cookies?.refreshToken;
      if (tokenToDecode) {
        try {
          const decoded = jwt.decode(tokenToDecode);
          if (decoded) {
            if (!userId) userId = decoded.user_mail || decoded.id;
            if (!rawRole) rawRole = decoded.role;
          }
        } catch (_) {}
      }
    }

    userId = userId || (action === 'USER_LOGIN' && req.body?.user_mail) || 'system';
    const role = rawRole || (action === 'USER_LOGIN' ? 'User' : null);

    // Detect if request originated from a VR headset or client
    const isVR = Boolean(
      isVRRequest ||
      module === 'VR Modules' ||
      action.includes('VR')
    );

    if (isVR) {
      if (module === 'General' || module === 'V1' || !module) {
        module = 'VR Modules';
      }
      if (action === 'USER_LOGIN') {
        action = 'VR_LOGIN';
        module = 'VR Modules';
        targetType = 'vr_device';
      }
    }

    // Extract target ID
    const targetId = req.params?.id ||
      req.params?.batch_id ||
      req.params?.course_id ||
      req.params?.targeted_learning_id ||
      req.params?.resource_id ||
      req.params?.volume_id ||
      req.body?.batch_id ||
      req.body?.course_id ||
      req.body?.trainee_id ||
      req.body?.user_id ||
      req.body?.resource_id ||
      req.body?.volume_id ||
      req.body?.session_id ||
      null;

    // Metadata
    const metadata = {
      method: req.method,
      endpoint: url,
      statusCode,
      name: req.body?.batch_name || req.body?.course_name || req.body?.user_name || req.body?.tar_name || req.body?.challenge_id || req.body?.resource_name || req.body?.resource_id || req.body?.volume_id || req.body?.session_id || req.body?.questionType || req.params?.resource_id || req.params?.volume_id || null,
      ip: req.ip || null,
      isVR,
      device: isVR ? (req.deviceInfo?.device || 'VR Headset') : (req.deviceInfo?.device || 'Browser')
    };

    // Asynchronously record activity
    setImmediate(() => {
      trackActivity({
        userId,
        role,
        action,
        module,
        targetType,
        targetId,
        status,
        metadata
      }).catch((err) => {
        console.error('Failed to log tracked activity in middleware:', err.message);
      });
    });
  });

  next();
};

module.exports = activityTrackerMiddleware;
