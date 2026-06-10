const express = require('express');
const router = express.Router();
const { register, login, verifyAccount, logout, resendOTP } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyAccount); 
router.post('/logout', logout);
router.post('/resend-otp', resendOTP);

module.exports = router;