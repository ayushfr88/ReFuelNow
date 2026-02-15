const Station = require('../models/Station');

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
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        const stations = await Station.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000 // 5km
                }
            }
        });

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

        const stations = await Station.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
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

        station = await Station.findByIdAndUpdate(
            req.params.id,
            { $set: { stationName, address, dieselPrice, petrolPrice } },
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
