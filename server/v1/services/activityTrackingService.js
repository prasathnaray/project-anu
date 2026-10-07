const client = require('../utils/conn');
const { broadcastActivity } = require('./socketService');

let tableInitialized = false;

const initActivityTable = async () => {
  if (tableInitialized) return;
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.activity_logs (
          id BIGSERIAL PRIMARY KEY,
          user_id VARCHAR(255),
          role VARCHAR(50),
          action VARCHAR(100) NOT NULL,
          module VARCHAR(100) NOT NULL,
          target_type VARCHAR(100),
          target_id VARCHAR(255),
          status VARCHAR(20) DEFAULT 'SUCCESS',
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_role ON public.activity_logs (role);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.activity_logs (module);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs (action);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON public.activity_logs (status);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);
    `);

    // Clean up any bogus POST_V1 noise and update any legacy 'User' entries with true roles
    await client.query(`
      DELETE FROM public.activity_logs 
      WHERE action = 'POST_V1' OR module = 'V1' OR user_id = 'anonymous';

      UPDATE public.activity_logs al
      SET role = CASE 
        WHEN ud.user_role = '99' THEN 'Super Admin'
        WHEN ud.user_role = '101' THEN 'Admin'
        WHEN ud.user_role = '102' THEN 'Instructor'
        WHEN ud.user_role = '103' THEN 'Trainee'
        ELSE al.role
      END
      FROM public.user_data ud
      WHERE LOWER(al.user_id) = LOWER(ud.user_email) AND (al.role = 'User' OR al.role IS NULL);
    `).catch(() => {});

    tableInitialized = true;
  } catch (err) {
    console.error('Failed to ensure activity_logs table:', err.message);
  }
};

const normalizeRole = (role) => {
  if (role === null || role === undefined) return 'User';
  const r = String(role).trim().toLowerCase();
  if (r === '99' || r.includes('super') || r === 'superadmin') return 'Super Admin';
  if (r === '101' || r === 'institution_admin' || r === 'institution admin' || (r.includes('admin') && !r.includes('super'))) return 'Admin';
  if (r === '102' || r.includes('tutor') || r.includes('instructor')) return 'Instructor';
  if (r === '103' || r.includes('student') || r.includes('trainee')) return 'Trainee';
  return 'User';
};

const formatActionDescription = (action, module, role, metadata = {}) => {
  const meta = typeof metadata === 'object' && metadata !== null ? metadata : {};
  const target = meta.name || meta.title || meta.batch_name || meta.module_name || meta.targetId || '';
  const actionLower = action.toLowerCase();

  if (actionLower.includes('button') || actionLower.includes('click')) {
    const btnName = meta.buttonName || meta.button || meta.targetId || target || 'Button';
    return `${role} clicked "${btnName}" in ${module}`.trim();
  }
  if (actionLower.includes('vr_session')) {
    return `${role} launched VR session ${target}`.trim();
  }
  if (actionLower.includes('complete_vr') || actionLower.includes('vr_resource')) {
    return `${role} completed VR module activity ${target}`.trim();
  }
  if (actionLower.includes('vr_data')) {
    return `${role} accessed VR training data`.trim();
  }
  if (actionLower.includes('create_batch') || actionLower.includes('batch_created')) {
    return `${role} created Batch ${target}`.trim();
  }
  if (actionLower.includes('update_batch') || actionLower.includes('batch_updated')) {
    return `${role} updated Batch ${target}`.trim();
  }
  if (actionLower.includes('delete_batch')) {
    return `${role} deleted Batch ${target}`.trim();
  }
  if (actionLower.includes('complete_challenge') || actionLower.includes('challenge_completed')) {
    return `${role} completed Challenge ${target}`.trim();
  }
  if (actionLower.includes('attempt_challenge') || actionLower.includes('challenge_attempted')) {
    return `${role} attempted Challenge ${target}`.trim();
  }
  if (actionLower.includes('create_user') || actionLower.includes('user_created')) {
    return `${role} created new user ${target}`.trim();
  }
  if (actionLower.includes('start_vr') || actionLower.includes('vr_attempt')) {
    return `${role} started VR test ${target}`.trim();
  }
  if (actionLower.includes('end_vr')) {
    return `${role} completed VR test ${target}`.trim();
  }
  if (actionLower.includes('submit_vr') || actionLower.includes('submit_ii')) {
    return `${role} submitted Image Interpretation in VR ${target}`.trim();
  }
  if (actionLower.includes('practice_attempt') || actionLower.includes('submit_prac')) {
    return `${role} submitted VR practice test ${target}`.trim();
  }
  if (actionLower.includes('save_vr') || actionLower.includes('uploadvolumerecording')) {
    return `${role} uploaded VR recording ${target}`.trim();
  }
  if (actionLower.includes('start_vr_stream') || actionLower.includes('vr_stream')) {
    return `${role} started VR live stream ${target}`.trim();
  }
  if (actionLower.includes('end_vr_stream')) {
    return `${role} ended VR live stream ${target}`.trim();
  }
  if (actionLower.includes('vr_login')) {
    return `${role} logged in via VR Headset`.trim();
  }
  if (actionLower.includes('upload_volume') || actionLower.includes('volume_uploaded')) {
    return `${role} uploaded volume ${target}`.trim();
  }
  if (actionLower.includes('approve_volume')) {
    return `${role} approved volume ${target}`.trim();
  }
  if (actionLower.includes('create_course')) {
    return `${role} created course ${target}`.trim();
  }
  if (actionLower.includes('create_targeted')) {
    return `${role} created Targeted Learning ${target}`.trim();
  }

  // Generic fallback
  const words = action.replace(/_/g, ' ').toLowerCase();
  const baseDesc = `${role} performed ${words} in ${module}${target ? ` (${target})` : ''}`;
  return meta.isVR && !baseDesc.includes('VR') ? `${baseDesc} (VR)` : baseDesc;
};

/**
 * Reusable Centralized Activity Tracking Function
 */
const trackActivity = async ({
  userId,
  role,
  action,
  module,
  targetType = null,
  targetId = null,
  status = 'SUCCESS',
  metadata = {}
}) => {
  try {
    if (!tableInitialized) {
      await initActivityTable();
    }

    let cleanRole = normalizeRole(role);
    const cleanAction = String(action || 'UNKNOWN_ACTION').toUpperCase().trim();
    const cleanModule = String(module || 'General').trim();
    const cleanStatus = String(status || 'SUCCESS').toUpperCase().trim() === 'FAILED' ? 'FAILED' : 'SUCCESS';
    const cleanUserId = userId ? String(userId) : 'system';
    const cleanTargetType = targetType ? String(targetType) : null;
    const cleanTargetId = targetId ? String(targetId) : null;
    const metaJson = typeof metadata === 'object' && metadata !== null ? JSON.stringify(metadata) : '{}';

    // If cleanRole is still 'User', try to resolve from user_data by email or people_id UUID
    if (cleanRole === 'User' && cleanUserId && cleanUserId !== 'system') {
      try {
        const isEmail = cleanUserId.includes('@');
        const queryText = isEmail
          ? 'SELECT user_role, user_email FROM public.user_data WHERE LOWER(user_email) = LOWER($1)'
          : 'SELECT user_role, user_email FROM public.user_data WHERE people_id::text = $1 OR LOWER(user_email) = LOWER($1)';
        const userRes = await client.query(queryText, [cleanUserId]);
        if (userRes.rows.length > 0) {
          if (userRes.rows[0].user_role) {
            cleanRole = normalizeRole(userRes.rows[0].user_role);
          }
          if (!isEmail && userRes.rows[0].user_email) {
            cleanUserId = userRes.rows[0].user_email;
          }
        }
      } catch (err) {
        console.error('Error resolving user_role for activity:', err.message);
      }
    }

    // Default VR actions with unresolved role to Trainee (VR users are learners/trainees)
    const isVRAction = Boolean(
      metadata?.isVR ||
      cleanModule === 'VR Modules' ||
      cleanAction.includes('VR') ||
      cleanAction.includes('PRACTICE')
    );
    if (cleanRole === 'User' && isVRAction) {
      cleanRole = 'Trainee';
    }

    const result = await client.query(
      `INSERT INTO public.activity_logs
        (user_id, role, action, module, target_type, target_id, status, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, NOW())
       RETURNING *`,
      [cleanUserId, cleanRole, cleanAction, cleanModule, cleanTargetType, cleanTargetId, cleanStatus, metaJson]
    );

    const log = result.rows[0];
    const enrichedLog = {
      ...log,
      description: formatActionDescription(log.action, log.module, log.role, log.metadata)
    };

    // Broadcast to connected Super Admins in real time via Socket.IO
    broadcastActivity(enrichedLog);

    // Asynchronously calculate and broadcast fresh aggregated statistics so all counters, progress bars, and module counts update in real-time
    setImmediate(async () => {
      try {
        const { broadcastStatsUpdate } = require('./socketService');
        const stats = await getActivityStatistics();
        broadcastStatsUpdate(stats);
      } catch (err) {
        console.error('Error broadcasting fresh stats update:', err.message);
      }
    });

    return enrichedLog;
  } catch (err) {
    console.error('trackActivity error:', err.message);
    return null;
  }
};

/**
 * Calculates global activity statistics
 */
const getActivityStatistics = async () => {
  if (!tableInitialized) {
    await initActivityTable();
  }

  const overviewQuery = client.query(`
    SELECT
      COUNT(*)::int AS total_actions,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int AS today_actions,
      COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW()))::int AS week_actions,
      COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW()))::int AS month_actions,
      COUNT(*) FILTER (WHERE status = 'SUCCESS')::int AS successful_actions,
      COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed_actions,
      -- Specific counts requested
      COUNT(*) FILTER (WHERE action IN ('CREATE_BATCH', 'BATCH_CREATED'))::int AS batch_created,
      COUNT(*) FILTER (WHERE action IN ('UPDATE_BATCH', 'BATCH_UPDATED'))::int AS batch_updated,
      COUNT(*) FILTER (WHERE action IN ('CREATE_USER', 'USER_CREATED', 'CREATE_TRAINEE'))::int AS users_created,
      COUNT(*) FILTER (WHERE action IN ('UPLOAD_VOLUME', 'VOLUME_UPLOADED', 'SV_UPLOAD'))::int AS volumes_uploaded,
      COUNT(*) FILTER (WHERE action IN ('ATTEMPT_CHALLENGE', 'CHALLENGE_ATTEMPTED', 'START_CHALLENGE'))::int AS challenges_attempted,
      COUNT(*) FILTER (WHERE action IN ('COMPLETE_CHALLENGE', 'CHALLENGE_COMPLETED', 'SUBMIT_CHALLENGE'))::int AS challenges_completed,
      COUNT(*) FILTER (WHERE action IN ('CERTIFICATE_GENERATED', 'CREATE_CERTIFICATE', 'GENERATE_CERTIFICATE'))::int AS certificates_generated,
      COUNT(*) FILTER (WHERE module = 'VR Modules' OR action LIKE '%VR%' OR (metadata->>'isVR') = 'true' OR (metadata->>'isvr') = 'true' OR (metadata->>'device') ILIKE '%vr%' OR action IN ('START_VR_TEST', 'END_VR_TEST', 'VR_ATTEMPT', 'VR_ATTEMPT_STARTED', 'PRACTICE_ATTEMPT', 'VR_SESSION', 'SUBMIT_VR_MEASUREMENT', 'SAVE_VR_RECORDING', 'START_VR_STREAM', 'END_VR_STREAM', 'VR_LOGIN', 'VR_DATA_ACCESS', 'COMPLETE_VR_RESOURCE'))::int AS vr_attempts
    FROM public.activity_logs
  `);

  const roleQuery = client.query(`
    SELECT COALESCE(role, 'Other') AS role, COUNT(*)::int AS count
    FROM public.activity_logs
    GROUP BY role
    ORDER BY count DESC
  `);

  const moduleQuery = client.query(`
    SELECT COALESCE(module, 'General') AS module, COUNT(*)::int AS count
    FROM public.activity_logs
    GROUP BY module
    ORDER BY count DESC
    LIMIT 10
  `);

  const actionQuery = client.query(`
    SELECT action, module, COUNT(*)::int AS count
    FROM public.activity_logs
    GROUP BY action, module
    ORDER BY count DESC
    LIMIT 15
  `);

  const trendQuery = client.query(`
    SELECT 
      TO_CHAR(d.day, 'YYYY-MM-DD') AS date,
      TO_CHAR(d.day, 'Mon DD') AS label,
      COUNT(al.id)::int AS count
    FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) d(day)
    LEFT JOIN public.activity_logs al 
      ON DATE_TRUNC('day', al.created_at) = d.day
    GROUP BY d.day
    ORDER BY d.day
  `);

  const recentQuery = client.query(`
    SELECT id, user_id, role, action, module, target_type, target_id, status, metadata, created_at
    FROM public.activity_logs
    ORDER BY created_at DESC
    LIMIT 50
  `);

  const [
    overviewRes,
    roleRes,
    moduleRes,
    actionRes,
    trendRes,
    recentRes
  ] = await Promise.all([
    overviewQuery,
    roleQuery,
    moduleQuery,
    actionQuery,
    trendQuery,
    recentQuery
  ]);

  const overview = overviewRes.rows[0] || {};
  const recentActivities = (recentRes.rows || []).map((row) => ({
    ...row,
    description: formatActionDescription(row.action, row.module, row.role, row.metadata)
  }));

  // Ensure default roles exist in role map
  const roleMap = {
    Instructor: 0,
    Trainee: 0,
    Admin: 0,
    'Super Admin': 0
  };
  (roleRes.rows || []).forEach((r) => {
    roleMap[r.role] = Number(r.count || 0);
  });

  return {
    totalActions: Number(overview.total_actions || 0),
    todayActions: Number(overview.today_actions || 0),
    weekActions: Number(overview.week_actions || 0),
    monthActions: Number(overview.month_actions || 0),
    successfulActions: Number(overview.successful_actions || 0),
    failedActions: Number(overview.failed_actions || 0),
    actionBreakdown: {
      batchCreated: Number(overview.batch_created || 0),
      batchUpdated: Number(overview.batch_updated || 0),
      usersCreated: Number(overview.users_created || 0),
      volumesUploaded: Number(overview.volumes_uploaded || 0),
      challengesAttempted: Number(overview.challenges_attempted || 0),
      challengesCompleted: Number(overview.challenges_completed || 0),
      certificatesGenerated: Number(overview.certificates_generated || 0),
      vrAttempts: Number(overview.vr_attempts || 0)
    },
    byRole: roleRes.rows || [],
    roleMap,
    byModule: moduleRes.rows || [],
    byAction: actionRes.rows || [],
    trendOverTime: trendRes.rows || [],
    recentActivities
  };
};

/**
 * Fetches recent activity logs with pagination and filters
 */
const getRecentActivities = async ({ limit = 50, page = 1, role, module, status } = {}) => {
  if (!tableInitialized) {
    await initActivityTable();
  }

  const offset = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
  const conditions = [];
  const params = [];

  if (role && role !== 'ALL') {
    params.push(normalizeRole(role));
    conditions.push(`role = $${params.length}`);
  }
  if (module && module !== 'ALL') {
    params.push(module);
    conditions.push(`module = $${params.length}`);
  }
  if (status && status !== 'ALL') {
    params.push(status.toUpperCase());
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(Math.max(1, parseInt(limit)));
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const result = await client.query(`
    SELECT id, user_id, role, action, module, target_type, target_id, status, metadata, created_at
    FROM public.activity_logs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `, params);

  const activities = (result.rows || []).map((row) => ({
    ...row,
    description: formatActionDescription(row.action, row.module, row.role, row.metadata)
  }));

  return activities;
};

module.exports = {
  initActivityTable,
  trackActivity,
  getActivityStatistics,
  getRecentActivities,
  normalizeRole,
  formatActionDescription
};
