const Order = require('../models/Order');
const Station = require('../models/Station');
const mongoose = require('mongoose');

// @desc    Get seller earnings
// @route   GET /api/seller/earnings
// @access  Private (Seller only)
exports.getEarnings = async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const sellerId = req.user.id;

        // Aggregate earnings for this seller from completed orders
        const stats = await Order.aggregate([
            {
                $match: {
                    sellerId: new mongoose.Types.ObjectId(sellerId),
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: '$stationId',
                    totalEarnings: { $sum: '$totalPrice' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // Get total earnings and total orders across all stations
        const totalEarnings = stats.reduce((acc, curr) => acc + curr.totalEarnings, 0);
        const totalOrders = stats.reduce((acc, curr) => acc + curr.totalOrders, 0);

        // Fetch station names to populate the breakdown
        // We'll map the stationIds from stats to station names
        // But some stations might have 0 orders, so we should fetch all seller stations first maybe?
        // For now, let's just populate the ones with orders or maybe a better approach is:

        // 1. Fetch all stations for this seller
        const stations = await Station.find({ sellerId });

        // 2. Map stats to stations
        const stationBreakdown = stations.map(station => {
            const stationStat = stats.find(s => s._id.toString() === station._id.toString());
            return {
                stationId: station._id,
                stationName: station.stationName,
                earnings: stationStat ? stationStat.totalEarnings : 0,
                ordersCount: stationStat ? stationStat.totalOrders : 0
            };
        });

        res.json({
            totalEarnings,
            totalOrders,
            stationBreakdown
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
