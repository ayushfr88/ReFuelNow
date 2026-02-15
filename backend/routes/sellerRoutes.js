const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/sellerController');
const auth = require('../middleware/authMiddleware');

router.get('/earnings', auth, getEarnings);

module.exports = router;
