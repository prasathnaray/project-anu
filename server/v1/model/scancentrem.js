const client = require('../utils/conn');
const createScancentrem = (REQUESTER, DATA) => {
    return Promise((resolve, reject) => {
        client.query('INSERT INTO scan_centers(center_name, center_email, center_phone, center_address) VALUES($1, )',[], (err, result) => {
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
module.exports = {
    createScancentrem
}