const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Address = sequelize.define('Address', {
    fullName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    phone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    street: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    state: { 
        type: DataTypes.STRING 
    },

    postalCode: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    country: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'VN' 
    },

    isDefault: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, { 
    timestamps: true 
});

module.exports = Address;