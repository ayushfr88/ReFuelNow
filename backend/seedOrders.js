const mongoose = require('mongoose');
const Order = require('./models/Order');
const Station = require('./models/Station');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const createMockOrders = async () => {
    try {
        // Find a seller
        const seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            console.log('No seller found. Please create a seller first.');
            process.exit();
        }

        // Find a station belonging to this seller
        const station = await Station.findOne({ sellerId: seller._id });
        if (!station) {
            console.log('No station found for this seller. Please add a station.');
            process.exit();
        }

        // Find a customer
        const customer = await User.findOne({ role: 'customer' });
        if (!customer) {
            console.log('No customer found. Please create a customer.');
            // Fallback: create a dummy customer if needed, but for now just exit
            process.exit();
        }

        const orders = [
            {
                customerId: customer._id,
                stationId: station._id,
                sellerId: seller._id,
                fuelType: 'diesel',
                quantity: 50,
                totalPrice: 4500,
                status: 'completed',
                createdAt: new Date()
            },
            {
                customerId: customer._id,
                stationId: station._id,
                sellerId: seller._id,
                fuelType: 'petrol',
                quantity: 20,
                totalPrice: 2000,
                status: 'completed',
                createdAt: new Date()
            },
            {
                customerId: customer._id,
                stationId: station._id,
                sellerId: seller._id,
                fuelType: 'petrol',
                quantity: 10,
                totalPrice: 1000,
                status: 'cancelled', // Should not count
                createdAt: new Date()
            }
        ];

        await Order.insertMany(orders);
        console.log('Mock orders created successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createMockOrders();
