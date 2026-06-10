const Product = require('../models/product.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

exports.getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const keyword = req.query.keyword || '';
        const categoryId = req.query.categoryId || null;
        const sellerId = req.query.sellerId || null;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

        const where = {
            name: { [Op.like]: `%${keyword}%` }
        };

        if (categoryId) where.categoryId = categoryId;
        if (sellerId) where.createdBy = sellerId;
        if (minPrice !== null) where.price = { ...where.price, [Op.gte]: minPrice };
        if (maxPrice !== null) where.price = { ...where.price, [Op.lte]: maxPrice };

        const { count, rows } = await Product.findAndCountAll({
            where,
            limit,
            offset,
            include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: ['category']
        });
        
        if (!product) {
            return res.status(404).json({ 
                message: "Product not found" 
            });
        }
        
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, categoryId, image } = req.body;

        if (!name || price === undefined) {
            res.status(400);
            throw new Error('name and price are required');
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock: stock ?? 0,
            categoryId,
            image,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        if (req.user.role === 'seller' && product.createdBy !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to edit this product');
        }

        const { name, description, price, stock, categoryId, image } = req.body;
        const updates = {};

        if (name !== undefined) {
            updates.name = name;
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (price !== undefined) {
            updates.price = price;
        }

        if (stock !== undefined) {
            updates.stock = stock;
        }

        if (categoryId !== undefined) {
            updates.categoryId = categoryId;
        }

        if (image !== undefined) {
            updates.image = image;
        }

        await product.update(updates);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        if (req.user.role === 'seller' && product.createdBy !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to delete this product');
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// VULNERABILITY CODE

exports.searchProductsVulnerableEasy = async (req, res, next) => {
    try {
        const keyword = req.query.keyword || '';
        const query = `SELECT * FROM Products WHERE name LIKE '%${keyword}%'`;

        const [results] = await sequelize.query(query);

        res.status(200).json({
            success: true,
            data: results,
            query_executed: query
        });
    } catch (error) {
        next(error);
    }
};

exports.searchProductsVulnerableMedium = async (req, res, next) => {
    try {
        let keyword = req.query.keyword || '';
        keyword = keyword.replace(/OR|AND|,|;|"/gi, '');
        const query = `SELECT * FROM Products WHERE name LIKE '%${keyword}%'`;

        const [results] = await sequelize.query(query);

        res.status(200).json({
            success: true,
            data: results,
            query_executed: query
        });
    } catch (error) {
        next(error);
    }
};