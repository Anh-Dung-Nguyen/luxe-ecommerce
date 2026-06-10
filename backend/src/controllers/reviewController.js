const { Review, Order, OrderItem, User, Product } = require('../models');

exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) {
            res.status(400);
            throw new Error('productId and rating are required');
        }

        const hasBought = await OrderItem.findOne({
            where: { productId },
            include: [{
                model: Order,
                where: { userId: req.user.id, status: 'delivered' }
            }]
        });

        if (!hasBought) {
            res.status(403);
            throw new Error('You can only review products you have purchased and received');
        }


        const review = await Review.create({
            userId: req.user.id,
            productId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (e) {
        next(e);
    }
};

exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: {
                productId: req.params.productId,
                isApproved: true
            },
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (e) {
        next(e);
    }
};

exports.approveReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        await review.update({ isApproved: true });

        res.json({
            success: true,
            data: review
        });
    } catch (e) {
        next(e);
    }
};

exports.getAllReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const approved = req.query.approved;

        const where = approved !== '' && approved !== undefined
            ? { isApproved: approved === 'true' }
            : {};

        const { count, rows } = await Review.findAndCountAll({
            where,
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Product, attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit
        });

        res.json({
            success: true,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        });
    } catch (e) {
        next(e);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        await review.destroy();

        res.json({ 
            success: true, 
            message: 'Review deleted successfully' 
        });
    } catch (e) {
        next(e);
    }
};

exports.reportReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id, {
            include: [{ model: Product, attributes: ['createdBy'] }]
        });

        if (!review) {
            res.status(404); 
            throw new Error('Review not found');
        }

        if (review.Product.createdBy !== req.user.id) {
            res.status(403); 
            throw new Error('You can only report reviews on your own products');
        }

        await review.update({ isReported: true });

        res.json({ 
            success: true, 
            message: 'Review reported to moderation' 
        });
    } catch (e) {
        next(e);
    }
};

// VULNERABILITY CODE

exports.createReviewVulnerableEasy = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        const review = await Review.create({
            userId: req.user.id,
            productId,
            rating,
            comment,
            isApproved: true
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (e) {
        next(e);
    }
};

exports.createReviewVulnerableMedium = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        let sanitizedComment = comment;
        if (sanitizedComment) {
            sanitizedComment = sanitizedComment
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<img\b[^>]*>/gi, '')
                .replace(/<iframe\b[^>]*>/gi, '')
                .replace(/<svg\b[^>]*>/gi, '');
        }

        const review = await Review.create({
            userId: req.user.id,
            productId,
            rating,
            comment: sanitizedComment,
            isApproved: true
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (e) {
        next(e);
    }
};