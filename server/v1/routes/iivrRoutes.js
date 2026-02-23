const express = require("express");
const iivrRouter = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const { createSubmission } = require("../controller/iivrController.js");
iivrRouter.post("/submit-ii", upload.single("userImage"), createSubmission);
module.exports = iivrRouter;