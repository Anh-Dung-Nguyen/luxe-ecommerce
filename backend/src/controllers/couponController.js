const { Coupon } = require('../models');

exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create({ 
            ...req.body, 
            createdBy: req.user.id 
        });

        res.status(201).json({ 
            success: true, 
            data: coupon 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.getCoupons = async (req, res, next) => {
    try {
        const where = req.user.role === 'seller' ? { createdBy: req.user.id } : {};

        res.json({ 
            success: true, 
            data: await Coupon.findAll({ 
                where,
                order: [['createdAt','DESC']] 
            }) 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.toggleCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByPk(req.params.id);
        if (!coupon) { 
            res.status(404); 
            throw new Error('Coupon not found'); 
        }

        if (req.user.role === 'seller' && coupon.createdBy !== req.user.id) {
            res.status(403); 
            throw new Error('Not authorized to modify this coupon');
        }

        await coupon.update({ isActive: !coupon.isActive });

        res.json({ 
            success: true, 
            data: coupon 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.validateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findOne({ 
            where: { 
                code: req.params.code, 
                isActive: true 
            } 
        });

        if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
            res.status(400); 
            throw new Error('Invalid or expired coupon');
        }

        res.json({ 
            success: true, 
            data: { 
                discountType: coupon.discountType, 
                discountValue: coupon.discountValue 
            } 
        });
    } catch (e) { 
        next(e); 
    }
};