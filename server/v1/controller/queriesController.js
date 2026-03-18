const { createQuerym, getQueriesm, getQueriesByUserm, updateQueryStatusm, deleteQuerym } = require('../model/queries.js');

const createQueryC = async (req, res) => {
    const requester = req.user;
    const { subject, instructor_id, message } = req.body;
    try {
        if (!subject || !message) {
            return res.status(400).json({
                code: 400,
                status: 'Subject and message are required'
            });
        }
        const result = await createQuerym(requester, subject, instructor_id, message);
        res.status(200).json({
            code: 200,
            status: 'Query created successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const getQueriesC = async (req, res) => {
    const requester = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const isAdmin = [99, 101].includes(Number(requester.role));
        let result;
        if (isAdmin) {
            result = await getQueriesm(requester, page, limit);
        } else {
            result = await getQueriesByUserm(requester, page, limit);
        }
        if (result.code === 401) {
            return res.status(401).json(result);
        }
        res.status(200).json({
            code: 200,
            status: 'Data retrieved successfully',
            result: result.rows,
            total: result.total
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const updateQueryStatusC = async (req, res) => {
    const requester = req.user;
    const { query_id } = req.params;
    const { status } = req.body;
    try {
        if (!status) {
            return res.status(400).json({
                code: 400,
                status: 'Status is required'
            });
        }
        const result = await updateQueryStatusm(requester, query_id, status);
        if (result.code === 401) {
            return res.status(401).json(result);
        }
        res.status(200).json({
            code: 200,
            status: 'Query status updated successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const deleteQueryC = async (req, res) => {
    const requester = req.user;
    const { query_id } = req.params;
    try {
        const result = await deleteQuerym(requester, query_id);
        if (result.code === 401) {
            return res.status(401).json(result);
        }
        res.status(200).json({
            code: 200,
            status: result.rowCount === 1 ? 'Query deleted successfully' : 'No query found to delete'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

module.exports = { createQueryC, getQueriesC, updateQueryStatusC, deleteQueryC };
