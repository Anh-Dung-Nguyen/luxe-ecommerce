const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Coupon = sequelize.define('Coupon', {
    code: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },

    discountType: { 
        type: DataTypes.ENUM('percent','fixed'), 
        allowNull: false 
    },

    discountValue: { 
        type: DataTypes.FLOAT,  
        allowNull: false 
    },

    minOrderValue: { 
        type: DataTypes.FLOAT,  
        defaultValue: 0 
    },

    maxUses: { 
        type: DataTypes.INTEGER, 
        defaultValue: null 
    },

    usedCount: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    expiresAt: { 
        type: DataTypes.DATE 
    },

    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isActive: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, { 
    timestamps: true 
});

module.exports = Coupon;