const client = require('../utils/conn.js');
const svUploadModel = () => {
    return new Promise((resolve, reject) => {
        client.query('', (err, result) => {
            if(err)
            {
                return reject(err)
            }
            else
            {
                return resolve(result);
            }
        })
    })
}
module.exports = svUploadModel;