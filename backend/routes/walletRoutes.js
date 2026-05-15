const express = require('express');
const router = express.Router();
const { getWalletBalance, createPaymentIntent, verifyPayment } = require('../controllers/walletController');
const auth = require('../middleware/authMiddleware'); // Ensuring we have auth middleware

// Validating auth middleware existence: We assume it's there based on identical structure in stationRoutes.js

router.get('/', auth, getWalletBalance);
router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;
