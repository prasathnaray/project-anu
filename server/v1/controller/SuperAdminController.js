const model = require('../model/SuperAdminm');
const { sendError } = require('./ContentAccessController');

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

module.exports = { list, create };
