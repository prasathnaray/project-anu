const { submitSession, getPracTestAttemptDetails } = require("../model/pracTestModel");

// const pracTestController = async (req, res) => {
//     const requester = req.user;
//     const { sessionType, sessionNumber } = req.body;
//     if (!sessionType || !sessionNumber) {
//         return res.status(400).json({ status: 'Error', message: 'sessionType and sessionNumber are required' });
//     }
//     if (!req.body.payload) {
//         return res.status(400).json({ status: 'Error', message: 'Payload is missing' });
//     }
//     let payload;
//     try {
//         payload = JSON.parse(req.body.payload);
//     } catch {
//         return res.status(400).json({ status: 'Error', message: 'Invalid JSON in payload' });
//     }
//     const rawFiles = req.files || {};
//     const imageMap = {};

//     for (const [key, file] of Object.entries(rawFiles)) {
//         const match = key.match(/^(user|expert)Images_(.+)$/);
//         if (match) {
//             const [, role, type] = match;
//             if (!imageMap[type]) imageMap[type] = {};
//             imageMap[type][role] = Array.isArray(file) ? file[0] : file;
//         }
//     }
//     const missingImages = (payload.measurements || [])
//         .filter(m => !imageMap[m.type]?.user || !imageMap[m.type]?.expert)
//         .map(m => m.type);

//     if (missingImages.length) {
//         return res.status(400).json({
//             status: 'Error',
//             message: `Missing images for measurements: ${missingImages.join(', ')}`,
//         });
//     }
//     try {
//         const result = await submitSession(requester, sessionType, sessionNumber, payload, imageMap);
//         return res.status(result.code).json(result);
//     } catch (err) {
//         console.error('pracTestController error:', err);
//         return res.status(500).json({ status: 'Error', message: err.message });
//     }
// };
// const pracTestController = async (req, res) => {
//     const requester = req.user;
//     const { sessionType, sessionNumber, resource_id , session_id } = req.body;
//     if (!session_id) {
//             return res.status(400).json({ status: 'Error', message: 'session_id is required' });
//     }
//     if (!sessionType || !sessionNumber) {
//         return res.status(400).json({ status: 'Error', message: 'sessionType and sessionNumber are required' });
//     }
//     if (!resource_id) {
//         return res.status(400).json({ status: 'Error', message: 'resource_id is required' });
//     }
//     if (!req.body.payload) {
//         return res.status(400).json({ status: 'Error', message: 'Payload is missing' });
//     }

//     let payload;
//     try {
//         payload = JSON.parse(req.body.payload);
//     } catch {
//         return res.status(400).json({ status: 'Error', message: 'Invalid JSON in payload' });
//     }

//     const rawFiles = req.files || {};
//     const imageMap = {};

//     for (const [key, file] of Object.entries(rawFiles)) {
//         const match = key.match(/^(user|expert)Images_(\d+)$/);
//         if (match) {
//             const [, role, index] = match;
//             const type = indexToType[Number(index)];
//             if (type) {
//                 if (!imageMap[type]) imageMap[type] = {};
//                 imageMap[type][role] = Array.isArray(file) ? file[0] : file;
//             }
//         }
//     }

//     const missingImages = (payload.measurements || [])
//         .filter(m => !imageMap[m.type]?.user || !imageMap[m.type]?.expert)
//         .map(m => m.type);

//     if (missingImages.length) {
//         return res.status(400).json({
//             status: 'Error',
//             message: `Missing images for measurements: ${missingImages.join(', ')}`,
//         });
//     }

//     try {
//         const result = await submitSession(requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap);
//         return res.status(result.code).json(result);
//     } catch (err) {
//         console.error('pracTestController error:', err);
//         return res.status(500).json({ status: 'Error', message: err.message });
//     }
// };

//the above code is working good


const pracTestController = async (req, res) => {
    const requester = req.user;
    const { sessionType, sessionNumber, resource_id, session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ status: 'Error', message: 'session_id is required' });
    }
    if (!sessionType || !sessionNumber) {
        return res.status(400).json({ status: 'Error', message: 'sessionType and sessionNumber are required' });
    }
    if (!resource_id) {
        return res.status(400).json({ status: 'Error', message: 'resource_id is required' });
    }
    if (!req.body.payload) {
        return res.status(400).json({ status: 'Error', message: 'Payload is missing' });
    }

    let payload;
    try {
        payload = JSON.parse(req.body.payload);
    } catch {
        return res.status(400).json({ status: 'Error', message: 'Invalid JSON in payload' });
    }

    // STEP 1 — build index→type map from payload FIRST
    // AC images are sent with suffix 2 and FL images with suffix 1.
    // Other measurement types retain their payload-position-based suffix.
    const imageIndexByType = {
        FL: 1,
        AC: 2,
    };
    const indexToType = {};
    (payload.measurements || []).forEach((m, i) => {
        const normalizedType = String(m.type || '').trim().toUpperCase();
        const imageIndex = imageIndexByType[normalizedType] || i + 1;
        indexToType[imageIndex] = m.type;
    });

    // STEP 2 — build imageMap using index
    const rawFiles = req.files || {};
    const imageMap = {};

    for (const [key, file] of Object.entries(rawFiles)) {
        // Accept the current singular field names as well as legacy plural names.
        const match = key.match(/^(user|expert)Images?_(\d+)$/);
        if (match) {
            const [, role, index] = match;
            const type = indexToType[Number(index)];
            if (type) {
                if (!imageMap[type]) imageMap[type] = {};
                imageMap[type][role] = Array.isArray(file) ? file[0] : file;
            }
        }
    }

    try {
        const result = await submitSession(requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap);
        return res.status(result.code).json(result);
    } catch (err) {
        console.error('pracTestController error:', err);
        return res.status(500).json({ status: 'Error', message: err.message });
    }
};

const getPracTestAttemptDetailsController = async (req, res) => {
    const requester = req.user;
    const { resource_id } = req.params;

    try {
        const result = await getPracTestAttemptDetails(requester, resource_id);
        return res.status(result.code).json(result);
    } catch (err) {
        console.error('getPracTestAttemptDetailsController error:', err);
        return res.status(500).json({ status: 'Error', message: err.message });
    }
};

module.exports = { pracTestController, getPracTestAttemptDetailsController };
