const client = require('../utils/conn');
const curiculumm = (curiculum_name, requester) => {
    const isPrivileged = [101, 99].includes(Number(requester.role));
    return new Promise((resolve, reject) => {  
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('INSERT INTO public.curiculum_data(curiculum_nam) VALUES($1)', [curiculum_name] ,(err, result) => {
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

const getCurriculumm = (requester) => {
    const isPrivileged = [101, 99, 102].includes(Number(requester.role));
    return new Promise((resolve, reject) => {
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission'
            })
        }
        client.query('SELECT * from public.curiculum_data', (err, result) => {
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
const deleteCuriculum = (curiculum_id, requester) => {
    const isPrivileged = [99].includes(Number(requester.role));
    return new Promise((resolve, reject) => {
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission'
            })
        }
        client.query('DELETE FROM public.curiculum_data WHERE curiculum_id=$1',[curiculum_id], (err, result) => {
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
module.exports = {curiculumm, getCurriculumm, deleteCuriculum}