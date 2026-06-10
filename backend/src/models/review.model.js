const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
    rating: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        validate: { 
            min: 1, 
            max: 5 
        } 
    },

    comment: { 
        type: DataTypes.TEXT 
    },

    isApproved: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },

    isReported: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, { 
    timestamps: true 
});

module.exports = Review;