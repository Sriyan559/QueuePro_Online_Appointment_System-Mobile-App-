const express = require('express');
const router = express.Router();
const {
    makePayment,
    getMyPayments,
    updatePayment,
    addPaymentMethod,
    getMyPaymentMethods,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, makePayment);

router.get('/my-payments', protect, getMyPayments);

router.route('/methods')
    .post(protect, addPaymentMethod)
    .get(protect, getMyPaymentMethods);

router.route('/:id')
    .put(protect, admin, updatePayment);

module.exports = router;
