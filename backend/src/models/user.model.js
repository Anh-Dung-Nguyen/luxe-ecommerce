const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: 'unique_email_role'
    },

    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    role: { 
        type: DataTypes.ENUM('admin', 'seller', 'client'), 
        defaultValue: 'client',
        unique: 'unique_email_role'
    },

    isVerified: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    },
    
    verificationCode: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;