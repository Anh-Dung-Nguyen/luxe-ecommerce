const { exec } = require('child_process');
const { error } = require('console');
const { stdout, stderr } = require('process');

exports.pingHost = (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid URL or IP address"
            });
        }

        const cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

        if (!/^[a-zA-Z0-9.-]+$/.test(cleanUrl)) {
            return res.status(400).json({
                success: false,
                message: "URL or IP is not valid. Please, do not use special characters."
            });
        }

        const isWindow = process.platform === 'win32';
        const pingCmd = isWindow ? `ping -n 4 ${cleanUrl}`: `ping -c 4 ${cleanUrl}`;

        exec(pingCmd, (error, stdout, stderr) => {
            if (error) {
                return res.json({
                    success: true,
                    data: stdout || stderr || "Cannot connect to this host"
                });
            }

            res.json({
                success: true,
                data: stdout
            });
        });

    } catch (error) {
        next(error);
    }
};

exports.pingHostVuln = (req, res) => {
    const host = req.body.host;

    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                succes: false,
                error: error.message
            });
        }

        res.json({
            success: true,
            data: stdout
        });
    });
};