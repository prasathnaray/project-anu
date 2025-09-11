const { progressm } = require("../model/pogressm");
const progressUpdate = async(req, res) => {
    const requester = req.user;
    const {user_id, course_id, module_id, isCompleted} = req.body;
    try
    {
        const result = await progressm(user_id, course_id, module_id, isCompleted);
        res.status(200).send(result);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err)
    }
}
module.exports = {progressUpdate}