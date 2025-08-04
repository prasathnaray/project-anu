const {curiculumm} = require('../model/curiculumm');
const createCur = async(req, res) => {
        const requester = req.user;
        const {curiculum_name} = req.body;
        try
        {
            const result = await curiculumm(curiculum_name, requester);
            res.status(200).json({
                err: 200,
                status: 'Success',
                result: result
            })
        }
        catch(err)
        {
            console.log(err)
        }
}
module.exports = {createCur}