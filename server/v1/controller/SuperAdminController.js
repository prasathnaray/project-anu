const model = require('../model/superAdminm');
const { sendError } = require('./ContentAccessController');
const {
    getActivityStatistics,
    getRecentActivities
} = require('../services/activityTrackingService');

const list = async (req, res) => {
    try {
        return res.status(200).json({ code: 200, status: 'Success', data: await model.listSuperAdmins(req.user) });
    } catch (error) {
        return sendError(res, error);
    }
};

const create = async (req, res) => {
    try {
        return res.status(201).json({ code: 201, status: 'Success', data: await model.createSuperAdmin(req.user, req.body) });
    } catch (error) {
        return sendError(res, error);
    }
};

const getStats = async (req, res) => {
    try {
        const [statsData, activityStats] = await Promise.all([
            model.getSuperAdminStats(req.user),
            getActivityStatistics().catch((err) => {
                console.error('Error fetching activity stats for dashboard:', err.message);
                return null;
            })
        ]);

        const merged = {
            ...statsData,
            globalActivityStats: activityStats
        };

        return res.status(200).json({
            code: 200,
            status: 'Success',
            ...merged,
            data: merged
        });
    } catch (error) {
        return sendError(res, error);
    }
};

const getGlobalStatistics = async (req, res) => {
    try {
        const stats = await getActivityStatistics();
        return res.status(200).json({
            code: 200,
            status: 'Success',
            data: stats,
            ...stats
        });
    } catch (error) {
        return sendError(res, error);
    }
};

const getActivitySummary = async (req, res) => {
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
        return sendError(res, error);
    }
};

const getRecentActivitiesController = async (req, res) => {
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
        return sendError(res, error);
    }
};

module.exports = {
    list,
    create,
    getStats,
    getGlobalStatistics,
    getActivitySummary,
    getRecentActivities: getRecentActivitiesController
};
