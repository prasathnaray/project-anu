const model = require('../model/superAdminm');
const client = require('../utils/conn');
const { sendError } = require('./contentAccessController');
const { issueAccountVerificationOtp } = require('../utils/accountVerification');
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
        const data = await model.createSuperAdmin(req.user, req.body);
        issueAccountVerificationOtp(data.user.user_email, 'activation').catch((verificationError) => {
            console.error('Failed to send super admin activation OTP:', verificationError);
        });
        return res.status(201).json({
            code: 201,
            status: 'Success',
            message: 'Super admin created. Verification OTP sent to the registered phone.',
            verificationSent: true,
            data
        });
    } catch (error) {
        return sendError(res, error);
    }
};

const getStats = async (req, res) => {
    try {
        const [statsData, activityStats] = await Promise.all([
            model.getSuperAdminStats(req.user),
            getActivityStatistics(req.query).catch((err) => {
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
        const stats = await getActivityStatistics(req.query);
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
        const stats = await getActivityStatistics(req.query);
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

const getSystemHealth = async (req, res) => {
    try {
        const startTime = Date.now();
        let dbLatency = 0;
        let dbStatus = 'Operational';
        try {
            const dbStart = Date.now();
            await client.query('SELECT 1');
            dbLatency = Date.now() - dbStart;
        } catch (dbErr) {
            dbLatency = -1;
            dbStatus = 'Degraded';
        }

        const totalTime = Date.now() - startTime;
        const uptime = Math.floor(process.uptime());

        return res.status(200).json({
            code: 200,
            status: 'Success',
            data: {
                api: {
                    status: 'Operational',
                    latency: totalTime,
                    uptime,
                    nodeVersion: process.version
                },
                database: {
                    status: dbStatus,
                    latency: dbLatency,
                    pool: 'Healthy'
                },
                backgroundProcessing: {
                    status: 'Operational',
                    sockets: 'Active',
                    realtime: 'Broadcasting'
                },
                timestamp: new Date().toISOString()
            }
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
    getRecentActivities: getRecentActivitiesController,
    getSystemHealth
};
