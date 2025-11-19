const {getCertByCurm} = require("../model/Certificationm.js");
const getCertificationByCurController = async(req, res) => {
    const requester = req.user;
    const curiculum_id = req.params.curiculum_id
    try
    {
        const result = await getCertByCurm(curiculum_id, requester)
        res.status(200).json({
            code: 200,
            status: 'Success',
            result: result.rows
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
}
module.exports = {getCertificationByCurController}