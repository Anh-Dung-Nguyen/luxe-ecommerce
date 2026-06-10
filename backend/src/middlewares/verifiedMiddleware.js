const isVerified = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        return next();
    }

    res.status(403);
    next(new Error('Please verify your email first'));
};

module.exports = { isVerified };