const User = require('./user.model');
const Product = require('./product.model');
const Category = require('./category.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const CartItem = require('./cart.model');
const Review = require('./review.model');
const Address = require('./address.model');
const Coupon = require('./coupon.model');

// Product <-> Category
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// Product -> User (créateur)
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Order -> User
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'shippingAddress' });
Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Order <-> OrderItem <-> Product
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Cart
CartItem.belongsTo(User, { foreignKey: 'userId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(CartItem, { foreignKey: 'userId', as: 'cart' });

// Review
Review.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Review.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });

// Coupon -> User (Créateur)
Coupon.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Coupon, { foreignKey: 'createdBy', as: 'coupons' });

// Address
Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });

module.exports = { User, Product, Category, Order, OrderItem, CartItem, Review, Address, Coupon };