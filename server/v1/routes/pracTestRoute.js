// const express = require('express');
// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
// const pracTestRouter = express.Router();
// const { pracTestController } = require('../controller/pracTestController');

// // POST /api/sessions
// pracTestRouter.post('/submit-prac-test',
//      upload.fields([
//         { name: 'userImages', maxCount: 10 },
//         { name: 'expertImages', maxCount: 10 }
//      ]),
//      pracTestController);

// module.exports = pracTestRouter;

const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const pracTestRouter = express.Router();
const { pracTestController } = require('../controller/pracTestController');

pracTestRouter.post(
    '/submit-prac-test',
    upload.fields([
        { name: 'userImages_1',   maxCount: 1 },
        { name: 'expertImages_1', maxCount: 1 },
        { name: 'userImages_2',   maxCount: 1 },
        { name: 'expertImages_2', maxCount: 1 },
    ]),
    pracTestController
);
module.exports = pracTestRouter;