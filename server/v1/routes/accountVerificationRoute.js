const express = require('express');
const { requestAccountVerification, verifyAccount } = require('../controller/accountVerificationController');

const router = express.Router();
router.post('/account-verification/request', requestAccountVerification);
router.post('/account-verification/verify', verifyAccount);

module.exports = router;
