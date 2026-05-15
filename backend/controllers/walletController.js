const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SZQKnawb3sNc4B',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'ly5k1pCODOXsEz65MZgzl7pQ'
});

// @desc    Get current user's wallet balance
// @route   GET /api/wallet
// @access  Private
exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('walletBalance');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ walletBalance: user.walletBalance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/wallet/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: 'receipt_' + Date.now()
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
        console.error('Error creating razorpay order:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/wallet/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || 'ly5k1pCODOXsEz65MZgzl7pQ';
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            return res.status(400).json({ message: 'Transaction not legit!' });
        }

        // Fetch order to know exact amount
        const order = await razorpayInstance.orders.fetch(razorpay_order_id);
        const amountAdded = order.amount / 100;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.walletBalance += amountAdded;
        await user.save();

        res.json({ 
            message: 'Payment successful', 
            walletBalance: user.walletBalance,
            amountAdded
        });
    } catch (err) {
        console.error('Error verifying razorpay payment:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
