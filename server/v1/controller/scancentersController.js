// controllers/scanCenterController.js
const { createScancentrem } = require("../model/scancentrem");

const createScanCenterC = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required. Please login.'
            });
        }
        // Validate requester has email
        if (!req.user.user_mail) {
            return res.status(400).json({
                status: 'error',
                message: 'User email not found in session. Please re-login.'
            });
        }
        const result = await createScancentrem(req.user, req.body);
        if (result.code === 401) {
            return res.status(401).json(result);
        }

        res.status(201).json({
            status: 'success',
            message: 'Scan center created successfully',
            data: result.data
        });
    } catch(err) {
        console.error('Error creating scan center:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the scan center',
            error: err.message
        });
    }
};
const mindsparkController = async(request, res) => {
    const {user_opt, correct_opt, status} = request.body;
    try {
        res.status(200).json({
             status, user_opt, correct_opt
        })
    }
    catch(err)
    {
        res.status(500).json({err});
    }
}
module.exports = {
    createScanCenterC,
    mindsparkController
};