const Product = require('../models/product.model');
const User = require('../models/user.model');
const { Order, OrderItem } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.count();
        const totalUsers = await User.count();
        const totalSellers = await User.count({ where: { role: 'seller' } });
        const totalClients = await User.count({ where: { role: 'client' } });

        const inventoryValue = await Product.findOne({
            attributes: [[sequelize.literal('SUM(price * stock)'), 'totalValue']],
            raw: true
        });

        const lowStockAlerts = await Product.findAll({
            where: {
                stock: { [Op.lt]: 10 }
            },
            attributes: ['id', 'name', 'stock'],
            order: [['stock', 'ASC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalUsers,
                userBreakdown: {
                    sellers: totalSellers,
                    clients: totalClients
                },
                totalInventoryValue: parseFloat(inventoryValue?.totalValue) || 0,
                actionRequired: {
                    lowStockCount: lowStockAlerts.length,
                    itemsToRestock: lowStockAlerts
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getSellerStats = async (req, res, next) => {
    try {
        const products = await Product.findAll({ where: { createdBy: req.user.id } });
        const productIds = products.map(p => p.id);

        if (productIds.length === 0) {
            return res.status(200).json({ 
                success: true, 
                data: { 
                    totalProducts: 0, 
                    totalSold: 0, 
                    totalRevenue: 0, 
                    salesPerProduct: {} 
                } 
            });
        }

        const soldItems = await OrderItem.findAll({
            where: { productId: { [Op.in]: productIds } },
            include: [{
                model: Order,
                where: { status: { [Op.in]: ['paid', 'processing', 'shipped', 'delivered'] } }
            }]
        });

        const totalRevenue = soldItems.reduce((acc, item) => acc + (item.quantity * item.priceAtOrder), 0);
        const totalSold = soldItems.reduce((acc, item) => acc + item.quantity, 0);

        const salesPerProduct = {};
        soldItems.forEach(item => {
            if (!salesPerProduct[item.productId]) {
                salesPerProduct[item.productId] = 0;
            }
            salesPerProduct[item.productId] += item.quantity;
        });

        res.status(200).json({
            success: true,
            data: {
                totalProducts: products.length,
                totalSold,
                totalRevenue,
                salesPerProduct
            }
        });
    } catch (error) {
        next(error);
    }
};