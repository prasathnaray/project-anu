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

    const payload = {
      action,
      module,
      targetType,
      targetId,
      status: status?.toUpperCase() === 'FAILED' ? 'FAILED' : 'SUCCESS',
      metadata,
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

export default trackActivity;
