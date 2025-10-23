const {getInstructorsm, deleteInstructorsm} = require('../model/instructorm');

const getInstructorData = async(req, res) => {
    const requester = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try
    {
        const result = await getInstructorsm(requester, page, limit);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}

const instructorController = async(req, res) => {
    const requester = req.user;
    const user_mail = req.params.user_mail
    try
    {
        const result = await deleteInstructorsm(requester, user_mail);
        res.status(200).json({
                affectedRows: result.rowCount,
                status: `${result.rowCount==0? 'Data not available': 'deleted successfully'}`
        });
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}
module.exports = {getInstructorData, instructorController};