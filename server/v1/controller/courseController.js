const {createCoursem, getCoursem, getCoursesByCurm} = require("../model/coursem");
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
module.exports = {CourseController, getCoursesC, getCoursesByCurController};