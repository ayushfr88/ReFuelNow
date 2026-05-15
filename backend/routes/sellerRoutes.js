const express = require('express');
const router = express.Router();
const { getEarnings, registerDeliveryMan, getDeliveryMen } = require('../controllers/sellerController');
const auth = require('../middleware/authMiddleware');

router.get('/earnings', auth, getEarnings);
router.post('/delivery-men', auth, registerDeliveryMan);
router.get('/delivery-men', auth, getDeliveryMen);

module.exports = router;
