const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getUserNotifications);
router.patch('/:id/read', auth, markAsRead);

module.exports = router;
