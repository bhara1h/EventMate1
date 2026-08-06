const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.get('/verifyemail/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
