const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

require('./src/models');

const { connectDB } = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');
const { apiLimiter, authLimiter } = require('./src/middlewares/rateLimiter');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/addresses', require('./src/routes/addressRoutes'));
app.use('/api/coupons', require('./src/routes/couponRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/ping', require('./src/routes/pingRoutes'));
app.use(errorHandler);

connectDB().then(() => app.listen(process.env.PORT || 5000,
    () => console.log(`Server running on port ${process.env.PORT || 5000}`)
));