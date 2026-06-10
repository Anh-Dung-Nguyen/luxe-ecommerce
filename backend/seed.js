require('dotenv').config();

const { sequelize } = require('./src/config/db');
const { User, Category, Product, Address, Coupon, Order, OrderItem, Review } = require('./src/models');

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database. Starting the seeding process...');

        const sellers = await User.findAll({ where: { role: 'seller' } });
        const clients = await User.findAll({ where: { role: 'client' } });

        if (sellers.length === 0 || clients.length === 0) {
            console.error('ERREUR: Vous devez créer au moins 1 compte Seller et 1 compte Client avant de lancer le script.');
            process.exit(1);
        }

        console.log('Génération des catégories...');
        const categoriesData = [];
        for (let i = 1; i <= 30; i++) {
            categoriesData.push({
                name: `Catégorie Premium ${i}`,
                slug: `categorie-premium-${i}`,
                description: `Description générée automatiquement pour la magnifique catégorie ${i}.`,
                isApproved: true
            });
        }
        await Category.bulkCreate(categoriesData, { ignoreDuplicates: true });
        const categories = await Category.findAll();

        console.log('Génération des produits...');
        const productsData = [];
        for (let i = 1; i <= 30; i++) {
            const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
            const randomCat = categories[Math.floor(Math.random() * categories.length)];
            
            productsData.push({
                name: `Produit de Luxe n°${i}`,
                description: `Un produit exceptionnel (Numéro ${i}) fabriqué avec les meilleurs matériaux. Parfait pour vous.`,
                price: parseFloat((Math.random() * 800 + 50).toFixed(2)),
                stock: Math.floor(Math.random() * 40) + 5,
                categoryId: randomCat.id,
                createdBy: randomSeller.id,
                image: `https://picsum.photos/seed/${i}/400/400`
            });
        }
        await Product.bulkCreate(productsData);
        const products = await Product.findAll();

        console.log('Génération des adresses...');
        const addressesData = [];
        for (let i = 1; i <= 30; i++) {
            const randomClient = clients[Math.floor(Math.random() * clients.length)];
            addressesData.push({
                fullName: `Client Test ${i}`,
                phone: `+84900000${i.toString().padStart(2, '0')}`,
                street: `${i} Avenue des Champs, Appartement ${i * 2}`,
                city: ['Hanoi', 'Paris', 'New York', 'Tokyo', 'London'][Math.floor(Math.random() * 5)],
                postalCode: `1000${i}`,
                country: 'VN',
                isDefault: i % 2 === 0,
                userId: randomClient.id
            });
        }
        await Address.bulkCreate(addressesData);
        const addresses = await Address.findAll();

        console.log('Génération des coupons...');
        const couponsData = [];
        for (let i = 1; i <= 30; i++) {
            const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
            couponsData.push({
                code: `PROMO${i}X${Math.floor(Math.random() * 999)}`,
                discountType: i % 2 === 0 ? 'percent' : 'fixed',
                discountValue: i % 2 === 0 ? 15 : 20,
                minOrderValue: 50,
                maxUses: 100,
                usedCount: Math.floor(Math.random() * 10),
                isActive: true,
                createdBy: randomSeller.id
            });
        }
        await Coupon.bulkCreate(couponsData, { ignoreDuplicates: true });

        console.log('Génération des commandes...');
        for (let i = 1; i <= 30; i++) {
            const randomClient = clients[Math.floor(Math.random() * clients.length)];
            const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
            
            const numItems = Math.floor(Math.random() * 3) + 1; 
            let totalPrice = 0;
            const orderItemsToCreate = [];

            for (let j = 0; j < numItems; j++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 3) + 1;
                totalPrice += randomProduct.price * qty;
                
                orderItemsToCreate.push({
                    productId: randomProduct.id,
                    quantity: qty,
                    priceAtOrder: randomProduct.price
                });
            }

            const order = await Order.create({
                userId: randomClient.id,
                addressId: randomAddress.id,
                totalPrice: totalPrice,
                status: ['paid', 'processing', 'shipped', 'delivered', 'pending'][Math.floor(Math.random() * 5)],
                paymentStatus: 'paid'
            });

            for (const item of orderItemsToCreate) {
                await OrderItem.create({
                    orderId: order.id,
                    ...item
                });
            }
        }

        console.log('Génération des avis...');
        const reviewsData = [];
        for (let i = 1; i <= 30; i++) {
            const randomClient = clients[Math.floor(Math.random() * clients.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            
            reviewsData.push({
                rating: Math.floor(Math.random() * 2) + 4,
                comment: `Vraiment impressionné par la qualité du produit ! Commande numéro ${i}.`,
                isApproved: i % 3 !== 0,
                isReported: i % 10 === 0,
                userId: randomClient.id,
                productId: randomProduct.id
            });
        }
        await Review.bulkCreate(reviewsData);

        console.log('SUCCÈS ! La base de données a été remplie avec succès.');
        process.exit(0);

    } catch (error) {
        console.error('ERREUR lors de l\'insertion :', error);
        process.exit(1);
    }
}

seedDatabase();