const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    status: {
        type: DataTypes.ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded'),
        defaultValue: 'pending'
    },

    totalPrice: { 
        type: DataTypes.FLOAT,   
        allowNull: false 
    },

    paymentMethod: { 
        type: DataTypes.STRING,  
        defaultValue: 'stripe' 
    },

    paymentStatus: { 
        type: DataTypes.ENUM('unpaid','paid','refunded'), 
        defaultValue: 'unpaid' 
    },

    stripePaymentId: { 
        type: DataTypes.STRING 
    },

    trackingNumber: { 
        type: DataTypes.STRING 
    },

    notes: { 
        type: DataTypes.TEXT 
    }
}, { 
    timestamps: true 
});

module.exports = Order;