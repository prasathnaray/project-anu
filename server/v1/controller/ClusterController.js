const { getClustersModel, getClusterByIdModel } = require('../model/ClusterModel');

const sendResult = (res, result, notFound = false) => res.status(result.code).json({
    code: result.code,
    status: result.code === 200 ? 'Success' : (notFound ? 'Not Found' : 'Forbidden'),
    ...(result.code === 200 ? { data: result.data } : { message: result.message })
});

const getClustersController = async (req, res) => {
    try { return sendResult(res, await getClustersModel(req.user)); }
    catch (err) {
        console.error('getClustersController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const getClusterByIdController = async (req, res) => {
    try {
        const result = await getClusterByIdModel(req.user, req.params.cluster_id);
        return sendResult(res, result, result.code === 404);
    } catch (err) {
        console.error('getClusterByIdController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

module.exports = { getClustersController, getClusterByIdController };
