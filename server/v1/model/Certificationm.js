const client = require('../utils/conn');
const getCertByCurm = (curiculum_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99, 101].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a persmission"
            })
        }
        client.query('SELECT * FROM certification_data WHERE curiculum_id=$1',[curiculum_id], (err, result) => {
            if(err)
            {
                return reject(err)
            }
            else
            {
                return resolve(result)
            }
        })
    })
}
module.exports = {getCertByCurm}