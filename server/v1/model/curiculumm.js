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
        const query = `
            SELECT 
                cd.*,
                (
                    SELECT COUNT(DISTINCT course_id)
                    FROM (
                        SELECT cert.certificate_id::text AS course_id
                        FROM public.certification_data cert
                        WHERE cert.certificate_id IS NOT NULL
                          AND ((cd.curiculum_id IS NOT NULL AND cert.curiculum_id::text = cd.curiculum_id::text)
                               OR (NULLIF(cd.curiculum_nam, '') IS NOT NULL AND LOWER(cert.curiculum_id::text) = LOWER(cd.curiculum_nam)))
                        UNION
                        SELECT co.course_id::text AS course_id
                        FROM public.course_data co
                        WHERE co.course_id IS NOT NULL
                          AND ((cd.curiculum_id IS NOT NULL AND co.curiculum_id::text = cd.curiculum_id::text)
                               OR (NULLIF(cd.curiculum_nam, '') IS NOT NULL AND LOWER(co.curiculum_id::text) = LOWER(cd.curiculum_nam)))
                    ) associated_courses
                )::int AS total_courses,
                (
                    SELECT COUNT(DISTINCT centre_id)
                    FROM (
                        SELECT bd.centre_id::text AS centre_id
                        FROM public.batch_data bd
                        WHERE bd.centre_id IS NOT NULL
                          AND ((cd.curiculum_id IS NOT NULL AND bd.curiculum_id = cd.curiculum_id::text)
                               OR (NULLIF(cd.curiculum_nam, '') IS NOT NULL AND LOWER(bd.curiculum_id) = LOWER(cd.curiculum_nam)))
                        UNION
                        SELECT cert.owner_centre_id::text AS centre_id
                        FROM public.certification_data cert
                        WHERE cert.owner_centre_id IS NOT NULL
                          AND ((cd.curiculum_id IS NOT NULL AND cert.curiculum_id::text = cd.curiculum_id::text)
                               OR (NULLIF(cd.curiculum_nam, '') IS NOT NULL AND LOWER(cert.curiculum_id::text) = LOWER(cd.curiculum_nam)))
                        UNION
                        SELECT cia.centre_id::text AS centre_id
                        FROM public.course_institution_access cia
                        JOIN public.certification_data cert ON cert.certificate_id = cia.course_id
                        WHERE cia.centre_id IS NOT NULL
                          AND ((cd.curiculum_id IS NOT NULL AND cert.curiculum_id::text = cd.curiculum_id::text)
                               OR (NULLIF(cd.curiculum_nam, '') IS NOT NULL AND LOWER(cert.curiculum_id::text) = LOWER(cd.curiculum_nam)))
                    ) associated_centres
                )::int AS total_centres
            FROM public.curiculum_data cd
        `;
        client.query(query, (err, result) => {
            if(err)
            {
                client.query('SELECT *, 0 AS total_courses, 0 AS total_centres FROM public.curiculum_data', (fallbackErr, fallbackRes) => {
                    if (fallbackErr) {
                        return reject(err);
                    }
                    return resolve(fallbackRes);
                });
            }
            else
            {
                return resolve(result);
            }
        });
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