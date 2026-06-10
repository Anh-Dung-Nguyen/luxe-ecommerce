const { Address } = require('../models');

exports.getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.findAll({ 
            where: { userId: req.user.id } 
        });

        res.json({ 
            success: true, 
            data: addresses 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.createAddress = async (req, res, next) => {
    try {
        if (req.body.isDefault) {
            await Address.update(
                { isDefault: false }, 
                { where: { userId: req.user.id } }
            );
        }

        const address = await Address.create({ 
            ...req.body, 
            userId: req.user.id 
        });

        res.status(201).json({ 
            success: true, 
            data: address 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.updateAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({ 
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            } 
        });

        if (!address) { 
            res.status(404); 
            throw new Error('Address not found'); 
        }

        if (req.body.isDefault) {
            await Address.update(
                { isDefault: false }, 
                { where: { userId: req.user.id } }
            );
        }

        await address.update(req.body);

        res.json({ 
            success: true, 
            data: address 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({ 
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            } 
        });

        if (!address) { 
            res.status(404); 
            throw new Error('Address not found'); 
        }

        await address.destroy();

        res.json({ 
            success: true, 
            message: 'Address deleted' 
        });
    } catch (e) { 
        next(e); 
    }
};