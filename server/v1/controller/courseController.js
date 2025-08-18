const {createCoursem, getCoursem, getCoursesByCurm, deleteCoursem, tagCoursem} = require("../model/coursem");
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
const getCoursesC = async(req, res) => {
    const requester = req.user;
    try
    {
        const result = await getCoursem(requester)
        res.status(200).json({
                code: 200,
                status: 'Success',
                result: result.rows
        })
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}

const getCoursesByCurController = async(req, res) => {
    const requester = req.user;
    const curiculum_id = req.params.curiculum_id
    try
    {
        const result = await getCoursesByCurm(curiculum_id, requester)
        res.status(200).json({
            code: 200,
            status: 'Success',
            result: result.rows
        })
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}
const courseDeletionController = async(req, res) => {
    const requester = req.user;
    const course_id = req.params.course_id;
    try
    {
        const result = await deleteCoursem(course_id, requester);
        let message;
        if (!result || result.rowCount == 0) {
            message = 'Data ain’t exists';
        } else {
            message = 'Deleted successfully';
        }
        res.status(200).json({
            code: 200,
            status: 'Success',
            result: message
        })
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
const tagCourseController = async(req, res) => {
    const requester = req.user;
    const {user_id, course_id} = req.body;
    if(!user_id || !course_id){
        return res.status(403).json({
            code: 403,
            status: 'Field should not be empty'
        })
    }
    try
    {
        const result = await tagCoursem(user_id, course_id, requester);
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {CourseController, getCoursesC, getCoursesByCurController, courseDeletionController, tagCourseController};