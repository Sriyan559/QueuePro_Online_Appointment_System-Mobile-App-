const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    getAllUsers,
    forgotPassword,
    resetPassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, admin, getAllUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
