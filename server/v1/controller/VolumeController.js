const VolumeController = async(req, res) => {
    const {} = req.body;
    try
    {
        const result = "test"
        res.status(200).send(result);
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = {VolumeController}