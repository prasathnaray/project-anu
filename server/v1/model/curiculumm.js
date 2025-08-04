const client = require('../utils/conn');
const curiculumm = (curiculum_name, requester) => {
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
module.exports = {curiculumm}