const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/utilityController');

router.get('/geocode', reverseGeocode);

module.exports = router;
