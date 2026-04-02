const { getSubmissionsM } = require('../model/submissionsm');

const getSubmissionsC = async (req, res) => {
    const requester = req.user;
    const resource_id = req.query.resource_id;
    try {
        const result = await getSubmissionsM(requester, resource_id);
        res.status(result.code || 200).json(result);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Internal Server Error'
        });
    }
};

module.exports = { getSubmissionsC };
