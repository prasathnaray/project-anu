const queriesm = (requester) => {
      return new Promise((resolve, reject) => {
            const isPrivileged = [99, 101].includes(Number(requester.role))
            if (!isPrivileged) {
                return {
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to access this profile.'
                };
            }
            client.query('INSERT INTO ', (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
            })
      })
}