const { CartItem, Product } = require('../models');

exports.getCart = async (req, res, next) => {
    try {
        const items = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ 
                model: Product, 
                as: 'product', 
                attributes: ['id','name','price','stock','image'] 
            }]
        });

        const total = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

        res.json({ 
            success: true, 
            data: items, 
            total 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findByPk(productId);
        if (!product) { 
            res.status(404); 
            throw new Error('Product not found'); 
        }

        if (product.stock < quantity) { 
            res.status(400); 
            throw new Error('Insufficient stock'); 
        }

        const [item, created] = await CartItem.findOrCreate({
            where: { 
                userId: req.user.id, 
                productId 
            },
            defaults: { quantity }
        });

        if (!created) {
            await item.increment('quantity', { by: quantity });
        }

        res.status(201).json({ 
            success: true, 
            data: item 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const item = await CartItem.findOne({ 
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            } 
        });

        if (!item) { 
            res.status(404); 
            throw new Error('Cart item not found'); 
        }

        await item.update({ quantity: req.body.quantity });

        res.json({ 
            success: true, 
            data: item 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const item = await CartItem.findOne({ 
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            } 
        });

        if (!item) { 
            res.status(404); 
            throw new Error('Cart item not found'); 
        }

        await item.destroy();

        res.json({ 
            success: true, 
            message: 'Item removed' 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        await CartItem.destroy({ 
            where: { userId: req.user.id } 
        });

        res.json({ 
            success: true, 
            message: 'Cart cleared' 
        });
    } catch (e) { 
        next(e); 
    }
};