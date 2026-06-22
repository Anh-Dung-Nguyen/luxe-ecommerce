const express = require('express');
const router = express.Router();
const { pingHost, pingHostVuln } = require('../controllers/pingController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.post('/ping-ok', protect, isAdmin, pingHost);
router.post('/ping-vuln', pingHostVuln);

module.exports = router;