const client = require('../utils/conn');
const getDashboardDatam = (requester) => {
    return new Promise((resolve, reject) => {
                const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
            // client.query('SELECT user_data.user_role, count(*) FROM user_data WHERE user_role !=$1 GROUP BY user_data.user_role;', ['101'], (err, result) => {
            //         if(err)
            //         {
            //             return reject(err)
            //         }
            //         else
            //         {
            //             return resolve(result);
            //         }
            // })
            // const getTraineesIns = new Promise((resolveQuery1, rejectQuery1) => {
            //         client.query('SELECT user_data.user_role, count(*) FROM user_data WHERE user_role !=$1 GROUP BY user_data.user_role;', ['102'], (err, result) => {
            //                 if(err)
            //                 {
            //                     return rejectQuery1(err)
            //                 }
            //                 else
            //                 {
            //                     return resolveQuery1(result);
            //                 }
            //         })
            // })
            const getTraineesIns = new Promise((resolveQuery1, rejectQuery1) => {
            client.query(
                `SELECT user_data.user_role, count(*) 
                FROM user_data 
                WHERE user_role IN ('102', '103') 
                GROUP BY user_data.user_role;`,
                (err, result) => {
                    if (err) {
                        return rejectQuery1(err);
                    } else {
                        return resolveQuery1(result);
                    }
                }
            );
            });
            const getBatchDas = new Promise((resolveQuery2, rejectQuery2) => {
                client.query('SELECT count(*) from batch_data', (err, result) => {
                    if(err)
                    {
                        return rejectQuery2(err)
                    }
                    else
                    {
                        return resolveQuery2(result);
                    }
                })
            })
            const TLStats = new Promise((resolve, reject) => {
                        client.query('SELECT * FROM targeted_learning' , (err, result) => {
                            if(err)
                            {
                                return reject(err)
                            }
                            else
                            {
                                return resolve(result.rows);
                            }
                        })
            })
            Promise.all([
                getTraineesIns,
                getBatchDas,
                TLStats
            ]).then(
                ([
                    getTraineesIns,
                    getBatchDas, 
                    TLStats  
                ]) => {
                    resolve({
                        getTraineesIns,
                        getBatchDas,
                        TLStats  
                    })
                }
            ).catch((err) => {
                        reject(err)
           })
    })
}
module.exports = {getDashboardDatam};