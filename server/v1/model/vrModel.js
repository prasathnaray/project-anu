const vrModel = (requester, data_check) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [101, 99, 102, 103].includes(Number(requester.role));
        if(!isPriviledged)
        {
                return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                });
        }
        resolve({
            code: 200,
            user_mail: requester.user_mail,
            data: data_check
        })
    })
}
module.exports = {vrModel};