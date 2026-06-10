const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.model');

const Product = sequelize.define('Product', {
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    description: { 
        type: DataTypes.TEXT 
    },

    price: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },

    stock: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0 
    },

    image: {
        type: DataTypes.STRING
    },
 
    categoryId: {
        type: DataTypes.INTEGER
    }
}, { 
    timestamps: true 
});

module.exports = Product;