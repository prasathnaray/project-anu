const { submitSession } = require("../model/pracTestModel");

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
    const indexToType = {};
    (payload.measurements || []).forEach((m, i) => {
        indexToType[i + 1] = m.type; // 1→BPD, 2→HC
    });

    // STEP 2 — build imageMap using index
    const rawFiles = req.files || {};
    const imageMap = {};

    for (const [key, file] of Object.entries(rawFiles)) {
        const match = key.match(/^(user|expert)Images_(\d+)$/);
        if (match) {
            const [, role, index] = match;
            const type = indexToType[Number(index)];
            if (type) {
                if (!imageMap[type]) imageMap[type] = {};
                imageMap[type][role] = Array.isArray(file) ? file[0] : file;
            }
        }
    }

    // STEP 3 — validate all measurements have images
    const missingImages = (payload.measurements || [])
        .filter(m => !imageMap[m.type]?.user || !imageMap[m.type]?.expert)
        .map(m => m.type);

    if (missingImages.length) {
        return res.status(400).json({
            status: 'Error',
            message: `Missing images for measurements: ${missingImages.join(', ')}`,
        });
    }

    try {
        const result = await submitSession(requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap);
        return res.status(result.code).json(result);
    } catch (err) {
        console.error('pracTestController error:', err);
        return res.status(500).json({ status: 'Error', message: err.message });
    }
};
module.exports = { pracTestController };