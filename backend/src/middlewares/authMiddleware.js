const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
 
const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
 
            if (!req.user) {
                res.status(401);
                return next(new Error('Not authorized, user not found'));
            }
 
            return next();
        } catch (error) {
            res.status(401);
            return next(new Error('Not authorized, token failed'));
        }
    }
 
    res.status(401);
    return next(new Error('Not authorized, no token'));
};
 
module.exports = { protect };