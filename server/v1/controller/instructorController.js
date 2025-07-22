const {getInstructorsm} = require('../model/instructorm');

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
module.exports = {getInstructorData};