const fs = require('fs');
const path = require('path');
const axios = require("axios");

exports.pathVuln = (req, res) => {
    const filePath = req.query.path || '';
    const fullPath = path.join(
        __dirname,
        '../..',
        filePath
    );

    fs.readFile(fullPath, 'utf8', (error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'File not found'
            });
        }

        res.set('Content-Type', 'text/plain');
        res.send(data);
    });
};

exports.pathOK = (req, res) => {
    const safeDir = path.resolve(__dirname, '../../uploads');

    const userInput = req.query.path || '';
    
    const finalPath = path.resolve(path.join(safeDir, userInput));

    if (!finalPath.startsWith(safeDir)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Directory Traversal Detected!'
        });
    }
    
    res.sendFile(finalPath, (err) => {
        if (err) {
            res.status(404).json({ 
                success: false, 
                message: 'File not found' 
            });
        }
    });
};

exports.viewNews = async (req, res) => {
    try {
        const url = req.query.url;
        const result = await axios.get(url);
        res.send(result.data);

    } catch (err) {
        res.status(500).send(err.message);
    }
};