const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFileVuln, uploadFile } = require('../controllers/uploadController');

const router = express.Router();

const storageVuln = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, timestamp + '_' + file.originalname);
    }
});

const uploadVuln = multer({ storage: storageVuln });
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.post('/uploadVuln', uploadVuln.single('file'),uploadFileVuln);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;