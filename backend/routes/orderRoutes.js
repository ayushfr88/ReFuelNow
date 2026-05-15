const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getStationOrders, updateOrderStatus, assignDeliveryMan, updateDeliveryStatus, getDeliveryTasks, getSellerEarnings } = require('../controllers/OrderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/delivery-tasks', auth, getDeliveryTasks);
router.get('/station/:stationId', auth, getStationOrders);
router.get('/seller-earnings', auth, getSellerEarnings);
router.patch('/:id/status', auth, updateOrderStatus);
router.patch('/:id/assign', auth, assignDeliveryMan);
router.patch('/:id/delivery-status', auth, updateDeliveryStatus);

module.exports = router;
