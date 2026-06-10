const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    }

    res.status(403);
    next(new Error('Access denied: admins only'));
};

const isSeller = (req, res, next) => {
    if (req.user?.role === 'seller') {
        return next();
    }

    res.status(403);
    next(new Error('Access denied: sellers only'));
};

const isAdminOrSeller = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'seller') {
        return next();
    }

    res.status(403);
    next(new Error('Access denied'));
};


module.exports = { isAdmin, isSeller, isAdminOrSeller };