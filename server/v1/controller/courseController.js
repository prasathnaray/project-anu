const {createCoursem} = require("../model/coursem");
const CourseController = async(req, res) => {
        const requester = req.user;
        const {course_name, curiculum_id} = req.body;
        try
        {
            const result = await createCoursem(course_name, curiculum_id, requester);
            res.status(200).json({
                code: 200,
                status: 'Success',
            })
        }
        catch(err)
        {
            res.status(500).send(err);
        }
}
module.exports = CourseController;