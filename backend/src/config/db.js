const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql', 
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database Connected successfully.');

        await sequelize.sync({ alter: true }); 
        console.log('Database models synchronized successfully.');
    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };