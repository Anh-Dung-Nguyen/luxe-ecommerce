const { User } = require('../models');
const { Op } = require('sequelize');

const VALID_ROLES = ['admin', 'seller', 'client'];

exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const keyword = req.query.keyword || '';
        const role = req.query.role || null;

        const where = {
            username: { [Op.like]: `%${keyword}%` }
        };

        if (role) {
            if (!VALID_ROLES.includes(role)) {
                res.status(400);
                throw new Error(`Invalid role filter. Must be one of: ${VALID_ROLES.join(', ')}`);
            }
            where.role = role;
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password', 'verificationCode'] },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
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

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role || !VALID_ROLES.includes(role)) {
            res.status(400);
            throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
        }

        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'verificationCode'] }
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.id === req.user.id) {
            res.status(400);
            throw new Error('Cannot change your own role');
        }

        await user.update({ role });

        res.json({
            success: true,
            data: user
        });
    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.id === req.user.id) {
            res.status(400);
            throw new Error('Cannot delete yourself');
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted'
        });
    } catch (e) {
        next(e);
    }
};