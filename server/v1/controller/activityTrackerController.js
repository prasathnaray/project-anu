const {
  trackActivity,
  getActivityStatistics,
  getRecentActivities
} = require('../services/activityTrackingService');

const trackClientActivity = async (req, res) => {
  try {
    const { action, module, targetType, targetId, status, metadata } = req.body;

    if (!action) {
      return res.status(400).json({
        code: 400,
        status: 'Error',
        message: 'Action is required'
      });
    }

    const userId = req.user?.user_mail || req.user?.people_id || req.body.userId || 'anonymous';
    const role = req.user?.role || req.body.role || 'User';

    const isVR = Boolean(
      metadata?.isVR ||
      req.user?.isVR ||
      req.user?.loginSource === 'VR Device' ||
      req.body?.isVr === true ||
      req.body?.isvr === true ||
      req.body?.isVR === true ||
      String(req.body?.isVr).toLowerCase() === 'true' ||
      String(req.body?.isvr).toLowerCase() === 'true' ||
      String(req.body?.isVR).toLowerCase() === 'true' ||
      req.query?.isVr === 'true' ||
      req.query?.isvr === 'true' ||
      req.query?.isVR === 'true' ||
      String(req.query?.isVr).toLowerCase() === 'true' ||
      req.deviceInfo?.isVR ||
      req.headers?.['x-device-type']?.toLowerCase()?.includes('vr') ||
      req.headers?.['x-client']?.toLowerCase()?.includes('vr') ||
      req.headers?.['x-vr-device'] ||
      req.headers?.['x-vr'] === 'true' ||
      req.headers?.['x-vr'] === true
    );

    const mergedMetadata = {
      ...(metadata || {}),
      ...(isVR ? { isVR: true, device: metadata?.device || 'VR Headset' } : {})
    };

    const recorded = await trackActivity({
      userId,
      role,
      action,
      module: isVR && (!module || module === 'General') ? 'VR Modules' : (module || 'General'),
      targetType,
      targetId,
      status: status || 'SUCCESS',
      metadata: mergedMetadata
    });

    return res.status(201).json({
      code: 201,
      status: 'Success',
      message: 'Activity tracked successfully',
      data: recorded
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to record activity',
      error: error.message
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const stats = await getActivityStatistics();
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: stats,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    return res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to retrieve activity statistics',
      error: error.message
    });
  }
};

const getRecent = async (req, res) => {
  try {
    const { limit, page, role, module, status } = req.query;
    const activities = await getRecentActivities({ limit, page, role, module, status });
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: activities,
      activities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to retrieve recent activities',
      error: error.message
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const stats = await getActivityStatistics();
    const summary = {
      totalActions: stats.totalActions,
      todayActions: stats.todayActions,
      weekActions: stats.weekActions,
      monthActions: stats.monthActions,
      successfulActions: stats.successfulActions,
      failedActions: stats.failedActions,
      actionBreakdown: stats.actionBreakdown,
      byRole: stats.byRole,
      byModule: stats.byModule
    };
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: summary,
      ...summary
    });
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    return res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to retrieve activity summary',
      error: error.message
    });
  }
};

module.exports = {
  trackClientActivity,
  getStatistics,
  getRecent,
  getSummary
};
