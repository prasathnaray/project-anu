const getVrData = (req, res) => {
    try
    {
        res.status(200).send("test");
    }
    catch(err)
    {
        res.status(500).send(err)
    }
}
module.exports = getVrData;