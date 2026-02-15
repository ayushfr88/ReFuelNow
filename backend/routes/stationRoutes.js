const express = require('express');
const router = express.Router();
const { addStation, getNearbyStations, getSellerStations, updateStation, deleteStation } = require('../controllers/stationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, addStation);
router.get('/nearby', auth, getNearbyStations);
router.get('/seller', auth, getSellerStations);
router.patch('/:id', auth, updateStation);
router.delete('/:id', auth, deleteStation);

module.exports = router;
