const express = require("express");
const router = express.Router();
const { getResourcesByUser } = require("../controllers/resourceController");

// GET /api/resources?user_id=dharani@gmail.com
router.get("/", getResourcesByUser);

module.exports = router;