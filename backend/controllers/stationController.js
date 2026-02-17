const Station = require('../models/Station');
const mongoose = require('mongoose');

// @desc    Add a new station
// @route   POST /api/stations
// @access  Private (Seller only)
exports.addStation = async (req, res) => {
    try {
        const { stationName, address, location, dieselPrice, petrolPrice } = req.body;

        // Ensure user is a seller
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Not authorized to add stations' });
        }

        const newStation = new Station({
            sellerId: req.user.id,
            stationName,
            address,
            location,
            dieselPrice,
            petrolPrice
        });

        const station = await newStation.save();
        res.json(station);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get nearby stations
// @route   GET /api/stations/nearby
// @access  Private (idk, maybe public too?)
exports.getNearbyStations = async (req, res) => {
    try {
        const { lat, lng, dist } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        const maxDistanceInMeters = (dist ? parseFloat(dist) : 5) * 1000;
        console.log(`Searching for stations near [${lng}, ${lat}] within ${maxDistanceInMeters}m`);

        const stations = await Station.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistanceInMeters,
                    spherical: true,
                    distanceMultiplier: 0.001 // Convert meters to km
                }
            },
            {
                $match: {
                    $or: [
                        { status: 'active' },
                        { status: { $exists: false } }
                    ]
                }
            }
        ]);

        console.log(`Found ${stations.length} stations.`);

        res.json(stations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get seller's stations
// @route   GET /api/stations/seller
// @access  Private (Seller only)
exports.getSellerStations = async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const stations = await Station.aggregate([
            { $match: { sellerId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'stationId',
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    pendingOrdersCount: {
                        $size: {
                            $filter: {
                                input: '$orders',
                                as: 'order',
                                cond: { $eq: ['$$order.status', 'pending'] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    orders: 0 // Remove the full orders array to keep response light
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(stations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a station
// @route   PATCH /api/stations/:id
// @access  Private (Seller only)
exports.updateStation = async (req, res) => {
    try {
        const { stationName, address, dieselPrice, petrolPrice } = req.body;

        let station = await Station.findById(req.params.id);

        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        // Make sure user owns station
        if (station.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // const { stationName, address, dieselPrice, petrolPrice, status } = req.body; // duplicate
        const { status } = req.body;


        station = await Station.findByIdAndUpdate(
            req.params.id,
            { $set: { stationName, address, dieselPrice, petrolPrice, status } },
            { new: true }
        );

        res.json(station);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a station
// @route   DELETE /api/stations/:id
// @access  Private (Seller only)
exports.deleteStation = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);

        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        // Make sure user owns station
        if (station.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Station.findByIdAndDelete(req.params.id);

        res.json({ message: 'Station removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
