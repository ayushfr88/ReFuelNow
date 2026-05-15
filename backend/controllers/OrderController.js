const Order = require('../models/Order');
const Station = require('../models/Station');
const Notification = require('../models/Notification');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { stationId, fuelType, quantity, useWallet } = req.body;

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
        } else if (fuelType === 'ev') {
            pricePerUnit = station.evPricePerKwh;
        } else {
            return res.status(400).json({ message: 'Invalid fuel type' });
        }

        const totalPrice = pricePerUnit * quantity;

        // Check Wallet Balance if useWallet is true (deferred deduction)
        if (useWallet) {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.walletBalance < totalPrice) {
                return res.status(400).json({ message: 'Insufficient wallet balance' });
            }
            // We don't deduct yet, we just verify they HAVE it.
        }

        // Create Order
        const newOrder = new Order({
            customerId: req.user.id,
            stationId,
            sellerId: station.sellerId,
            fuelType,
            quantity,
            totalPrice,
            paymentMethod: useWallet ? 'wallet' : 'cash',
            paymentStatus: 'unpaid'
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
            .populate('deliveryManId', 'name phone')
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

        if (status === 'accepted' || status === 'rejected') {
            const unit = order.fuelType === 'ev' ? 'kw' : 'L';
            await Notification.create({
                userId: order.customerId,
                orderId: order._id,
                message: `Your order for ${order.quantity}${unit} ${order.fuelType} has been ${status}.`
            });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Assign a delivery man to an order
// @route   PATCH /api/orders/:id/assign
// @access  Private (Seller only)
exports.assignDeliveryMan = async (req, res) => {
    try {
        const { deliveryManId } = req.body;
        const User = require('../models/User');

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify seller owns the order
        if (order.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verify the delivery man exists and belongs to this seller
        const deliveryMan = await User.findOne({ _id: deliveryManId, role: 'delivery_man' });
        if (!deliveryMan) {
            return res.status(404).json({ message: 'Delivery man not found' });
        }

        if (deliveryMan.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Delivery man does not belong to this seller' });
        }

        order.deliveryManId = deliveryManId;
        order.deliveryStatus = 'assigned';
        await order.save();

        // Notify Customer
        await Notification.create({
            userId: order.customerId,
            orderId: order._id,
            message: `A delivery man (${deliveryMan.name}) has been assigned to your order.`
        });

        // Notify Delivery Man
        await Notification.create({
            userId: deliveryManId,
            orderId: order._id,
            message: `You have been assigned a new delivery task.`
        });

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update delivery status
// @route   PATCH /api/orders/:id/delivery-status
// @access  Private (Delivery Man only)
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryStatus } = req.body;
        const validStatuses = ['pending', 'assigned', 'out_for_delivery', 'delivered'];

        if (!validStatuses.includes(deliveryStatus)) {
            return res.status(400).json({ message: 'Invalid delivery status' });
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify requester is the assigned delivery man
        if (order.deliveryManId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (deliveryStatus === 'delivered') {
            console.log(`Order ${order._id} marking as delivered. Checking payment...`);
            order.status = 'completed';
            
            // Handle Wallet Transfer
            console.log(`Payment Details: Method=${order.paymentMethod}, Status=${order.paymentStatus}`);
            
            if (order.paymentMethod === 'wallet' && order.paymentStatus === 'unpaid') {
                const User = require('../models/User');
                const customer = await User.findById(order.customerId);
                const seller = await User.findById(order.sellerId);

                if (!customer || !seller) {
                    console.error("Payment failed: Customer or seller not found");
                    return res.status(404).json({ message: 'Customer or Seller not found for payment transfer' });
                }

                if (customer.walletBalance < order.totalPrice) {
                    console.error("Payment failed: Insufficient customer balance");
                    return res.status(400).json({ message: 'Customer has insufficient balance to complete delivery via wallet. Please collect cash or ask them to top up.' });
                }

                // Transfer Funds
                customer.walletBalance -= order.totalPrice;
                seller.walletBalance += order.totalPrice;

                await customer.save();
                await seller.save();
                order.paymentStatus = 'paid';
                console.log(`Wallet transfer successful: ₹${order.totalPrice} from ${customer.name} to ${seller.name}`);
            } else {
                console.log(`Skipping wallet transfer: Already paid, cash order, or missing payment info (Old Order).`);
            }
        }
        order.deliveryStatus = deliveryStatus;
        await order.save();

        // Notify Customer
        await Notification.create({
            userId: order.customerId,
            orderId: order._id,
            message: `Your order delivery status is now: ${deliveryStatus.replace(/_/g, ' ')}.`
        });

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get delivery man's tasks
// @route   GET /api/orders/delivery-tasks
// @access  Private (Delivery Man only)
exports.getDeliveryTasks = async (req, res) => {
    try {
        const orders = await Order.find({ deliveryManId: req.user.id })
            .populate('customerId', 'name phone address email')
            .populate('stationId', 'stationName address')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get seller's earnings (completed & paid orders)
// @route   GET /api/orders/seller-earnings
// @access  Private (Seller only)
exports.getSellerEarnings = async (req, res) => {
    try {
        const orders = await Order.find({ 
            sellerId: req.user.id, 
            status: 'completed',
            paymentStatus: 'paid'
        })
        .populate('customerId', 'name phone')
        .populate('stationId', 'stationName')
        .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
