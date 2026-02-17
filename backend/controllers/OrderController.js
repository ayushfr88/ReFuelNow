const Order = require('../models/Order');
const Station = require('../models/Station');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { stationId, fuelType, quantity } = req.body;

        // Validation
        if (!stationId || !fuelType || !quantity) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Find Station
        const station = await Station.findById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        // Calculate Price
        let pricePerUnit = 0;
        if (fuelType === 'diesel') {
            pricePerUnit = station.dieselPrice;
        } else if (fuelType === 'petrol') {
            pricePerUnit = station.petrolPrice;
        } else {
            return res.status(400).json({ message: 'Invalid fuel type' });
        }

        const totalPrice = pricePerUnit * quantity;

        // Create Order
        const newOrder = new Order({
            customerId: req.user.id,
            stationId,
            sellerId: station.sellerId,
            fuelType,
            quantity,
            totalPrice
        });

        const order = await newOrder.save();
        res.status(201).json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('stationId', 'stationName address dieselPrice petrolPrice')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get orders for a specific station
// @route   GET /api/orders/station/:stationId
// @access  Private (Seller only)
exports.getStationOrders = async (req, res) => {
    try {
        const station = await Station.findById(req.params.stationId);

        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        // Ensure user is the owner of the station
        if (station.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const orders = await Order.find({ stationId: req.params.stationId })
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Seller only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify seller owns the station associated with the order
        // Note: Order schema doesn't explicitly store sellerId in populate, but we can check via station or if we stored sellerId on order creation (we did)
        if (order.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
