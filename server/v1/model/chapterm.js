const client = require('../utils/conn');
const getChapterModel = (course_id, requester) => {
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
        client.query('SELECT * FROM chapter_data WHERE course_id=$1', [course_id], (err, result) => {
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
module.exports = {getChapterModel}