const client = require('../utils/conn.js');
const createBatchm = (batch_id, batch_name, batch_start_date, batch_end_date, requester) => {
        return new Promise((resolve, reject) => {
                const isPrivileged = [101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this course data.'
                    });
                }
                client.query('INSERT INTO batch_data(batch_id, batch_name, batch_start_date, batch_end_date) VALUES($1, $2, $3, $4)', [batch_id, batch_name, batch_start_date, batch_end_date], (err, result) => {
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
const getBatchm = (requester) => {
    const isPrivileged = [101].includes(Number(requester.role));
    if(!isPrivileged) {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access this course data.'
        });
    }
    return new Promise((resolve, reject) => {
        client.query('SELECT * from public.batch_data' , (err, result) => {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(result)
            }
        })
    })
}
module.exports = {createBatchm, getBatchm};