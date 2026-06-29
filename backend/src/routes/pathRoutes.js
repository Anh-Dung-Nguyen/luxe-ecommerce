const express = require('express');
const { pathVuln, pathOK, viewNews } = require('../controllers/pathController');

const router = express.Router();

router.get('/pathVuln', pathVuln);
router.get('/pathOK', pathOK);
router.get('/news', viewNews);

module.exports = router;