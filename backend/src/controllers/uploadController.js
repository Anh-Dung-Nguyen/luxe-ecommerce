const fs = require('fs');
const path = require('path');
const { fileTypeFromFile } = require('file-type');

exports.uploadFileVuln = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'No file uploaded.' 
        });
    }

    res.json({
        success: true,
        filename: req.file.filename
    });
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const blockedExtensions = [
            '.php',
            '.jsp',
            '.asp',
            '.aspx',
            '.exe',
            '.bat',
            '.cmd',
            '.sh'
        ];

        const extension = path.extname(req.file.originalname).toLowerCase();

        if (blockedExtensions.includes(extension)) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                success: false,
                message: 'Executable files are not allowed'
            });
        }

        const fileInfo = await fileTypeFromFile(req.file.path);

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf'
        ];

        if (!fileInfo || !allowedMimeTypes.includes(fileInfo.mime)) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                success: false,
                message: 'Invalid file signature'
            });
        }

        return res.json({
            success: true,
            filename: req.file.filename
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};