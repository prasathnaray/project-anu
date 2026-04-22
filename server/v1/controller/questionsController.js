const questionsController = (req, res) => {
    const {resource_id, question_no, question_query, correct_answer, options_available} = req.body;
    try
    {
        res.status(200).json({
                resource_id, question_no, question_query, correct_answer, options_available
        })
    }
    catch(err)
    {
        res.status(500).json({
            message: "Error in creating question"
        })
    }
}
module.exports = {questionsController}