const {getInstructorsm, deleteInstructorsm} = require('../model/instructorm');

const getInstructorData = async(req, res) => {
    const requester = req.user
    try
    {
        const result = await getInstructorsm(requester);
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