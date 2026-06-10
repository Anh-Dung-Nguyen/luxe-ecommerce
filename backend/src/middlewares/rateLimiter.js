const rateLimit = require('express-rate-limit');

// bloque brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { success: false, message: 'Too many attempts, try again later' }
});

// bloque DDOS
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100
});

module.exports = { authLimiter, apiLimiter };