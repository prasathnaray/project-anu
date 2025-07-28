const client = require('../utils/conn.js');
const createBatchm = (batch_name, batch_start_date, batch_end_date, requester) => {
        return new Promise((resolve, reject) => {
                const isPrivileged = [101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this course data.'
                    });
                }
                client.query('INSERT INTO batch_data(batch_name, batch_start_date, batch_end_date) VALUES($1, $2, $3)', [batch_name, batch_start_date, batch_end_date], (err, result) => {
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
const associateBatchm = (requester, batch_id, user_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO public.batch_people_data(batch_id, user_id) VALUES($1, $2)', [batch_id, user_id] ,(err, result) => {
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
const deleteBatchm = (requester, batch_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('DELETE FROM batch_data WHERE batch_id=$1', [batch_id], (err, result) => {
            if(err)
            {
                reject(err)
            }   
            else
            {
                resolve(result);
            }
        })
    })
}
module.exports = {createBatchm, getBatchm, associateBatchm, deleteBatchm};