const {getChapterModel} = require('../model/chapterm');
const getChapters = async(req, res) => {
    const requester = req.user;
    const {course_id} = req.query;
    try
    {
        const result = await getChapterModel(course_id, requester);
        res.status(200).send(result.rows);    
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {getChapters};