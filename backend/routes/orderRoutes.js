const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getStationOrders, updateOrderStatus } = require('../controllers/OrderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/station/:stationId', auth, getStationOrders);
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;
