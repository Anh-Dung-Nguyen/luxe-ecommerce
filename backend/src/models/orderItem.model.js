const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },

    priceAtOrder: { 
        type: DataTypes.FLOAT,   
        allowNull: false 
    }
}, { 
    timestamps: false 
});

module.exports = OrderItem;