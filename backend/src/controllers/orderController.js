const { Order, OrderItem, Product, CartItem, Coupon, Address, User } = require('../models');
const sendEmail = require('../utils/sendEmail');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const VALID_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

exports.createOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { addressId, couponCode, notes } = req.body;

        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ 
                model: Product, 
                as: 'product',
                include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }]
            }]
        });

        if (!cartItems.length) {
            res.status(400); 
            throw new Error('Cart is empty');
        }

        for (const item of cartItems) {
            if (!item.product) {
                res.status(400); 
                throw new Error(`Product not found for cart item ${item.id}`);
            }
            if (item.product.stock < item.quantity) {
                res.status(400); 
                throw new Error(`Insufficient stock for "${item.product.name}"`);
            }
        }

        let totalPrice = cartItems.reduce((s, i) => s + i.quantity * i.product.price, 0);
        let couponId = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
            if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
                res.status(400); 
                throw new Error('Invalid or expired coupon');
            }
            if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
                res.status(400); 
                throw new Error('Coupon usage limit reached');
            }
            if (totalPrice < coupon.minOrderValue) {
                res.status(400); 
                throw new Error(`Minimum order value: ${coupon.minOrderValue}`);
            }

            const discount = coupon.discountType === 'percent' 
                ? (totalPrice * coupon.discountValue / 100) 
                : coupon.discountValue;

            totalPrice = Math.max(0, totalPrice - discount);
            couponId = coupon.id;
            await coupon.increment('usedCount', { transaction: t });
        }

        const order = await Order.create(
            { userId: req.user.id, addressId, couponId, totalPrice, notes },
            { transaction: t }
        );

        let clientEmailHtml = '';
        const sellerNotifications = {};

        for (const item of cartItems) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: item.product.price
            }, { transaction: t });

            item.product.stock -= item.quantity;
            await item.product.save({ transaction: t });

            clientEmailHtml += `<li>${item.quantity}x <strong>${item.product.name}</strong> - $${(item.quantity * item.product.price).toFixed(2)}</li>`;

            const sellerEmail = item.product.creator.username;
            if (!sellerNotifications[sellerEmail]) {
                sellerNotifications[sellerEmail] = [];
            }
            sellerNotifications[sellerEmail].push(item);
        }

        await CartItem.destroy({ 
            where: { userId: req.user.id }, 
            transaction: t 
        });

        await t.commit();

        try {
            await sendEmail({
                email: req.user.username,
                subject: `Luxe. - Order #${order.id} Confirmed`,
                html: `
                    <h2>Thank you for your order!</h2>
                    <p>Here is the summary of your purchases:</p>
                    <ul>${clientEmailHtml}</ul>
                    <h3>Total Paid: $${totalPrice.toFixed(2)}</h3>
                    <p>You can track your order status in your account.</p>
                `
            });

            for (const [sellerEmail, itemsSold] of Object.entries(sellerNotifications)) {
                let sellerItemsHtml = itemsSold.map(i => `<li>${i.quantity}x <strong>${i.product.name}</strong> (Stock remaining: ${i.product.stock})</li>`).join('');
                
                await sendEmail({
                    email: sellerEmail,
                    subject: `Luxe. - You have a new sale! (Order #${order.id})`,
                    html: `
                        <h2>Congratulations!</h2>
                        <p>A customer just purchased items from your store:</p>
                        <ul>${sellerItemsHtml}</ul>
                        <p>Please log in to your Seller Dashboard to process this order.</p>
                    `
                });
            }
        } catch (emailError) {
            console.error('Failed to send notification emails:', emailError.message);
        }

        res.status(201).json({ 
            success: true, 
            data: order 
        });
    } catch (e) {
        await t.rollback();
        next(e);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product', attributes: ['name', 'image'] }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (e) {
        next(e);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }]
        });

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        res.json({
            success: true,
            data: order
        });
    } catch (e) {
        next(e);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            }
        });

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (!['pending', 'paid'].includes(order.status)) {
            res.status(400);
            throw new Error('Order cannot be cancelled at this stage');
        }

        await order.update({ status: 'cancelled' });

        res.json({
            success: true,
            message: 'Order cancelled'
        });
    } catch (e) {
        next(e);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || null;

        if (status && !VALID_STATUSES.includes(status)) {
            res.status(400);
            throw new Error('Invalid status filter');
        }

        const where = status ? { status } : {};

        if (req.user.role === 'seller') {
            const sellerProducts = await Product.findAll({ 
                where: { createdBy: req.user.id },
                attributes: ['id']
            });
            const productIds = sellerProducts.map(p => p.id);

            const sellerOrderItems = await OrderItem.findAll({
                where: { productId: { [Op.in]: productIds } },
                attributes: ['orderId']
            });
            const orderIds = sellerOrderItems.map(item => item.orderId);

            if (orderIds.length === 0) {
                return res.json({
                    success: true,
                    totalItems: 0,
                    totalPages: 1,
                    currentPage: page,
                    data: []
                });
            }

            where.id = { [Op.in]: orderIds };
        }

        const { count, rows } = await Order.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            include: [
                { model: User, as: 'user', attributes: ['id', 'username'] },
                { 
                    model: OrderItem, 
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']],
            distinct: true 
        });

        if (req.user.role === 'seller') {
            rows.forEach(order => {
                order.items = order.items.filter(item => item.product?.createdBy === req.user.id);
            });
        }

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

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, trackingNumber } = req.body;

        if (!status || !VALID_STATUSES.includes(status)) {
            res.status(400);
            throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
        }

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const updates = { status };
        if (trackingNumber !== undefined) {
            updates.trackingNumber = trackingNumber;
        }

        await order.update(updates);

        res.json({
            success: true,
            data: order
        });
    } catch (e) {
        next(e);
    }
};