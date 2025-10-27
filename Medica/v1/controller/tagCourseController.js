const TagCourseController = async(req, res) => {
    try
    {
        res.status(200).send("Hello")
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}
module.exports = TagCourseController;