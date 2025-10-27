const vrModel = require('../model/vrModel.js');
const {ListParticipantsCommand } = require('@aws-sdk/client-ivs-realtime');
const ivsClient = require('../utils/ivssetup.js')
const getVrData = async(req, res) => {
    const requester = req.user;
    const data_check = req.params.data_check
    try
    {
        //const result = 
        res.status(200).send(await vrModel(requester, data_check));
    }
    catch(err)
    {
        res.status(500).send(err)
        ContentVisibilityAutoStateChangeEvent.l
    }
}
const getActivePeopleC = async(req, res) => {
    const {roomId} = req.body;
    try
    {
        const resp = await ivsClient.send(new ListParticipantsCommand({
            roomIdentifier: roomId
        }));
        res.status(200).json({
                    participants: resp.participants || []
        });
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send(err)
    }
}
module.exports = {getVrData, getActivePeopleC};