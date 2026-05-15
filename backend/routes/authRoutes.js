const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, updatePassword, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.put('/update-password', auth, updatePassword);
router.put('/profile', auth, updateProfile);

module.exports = router;
