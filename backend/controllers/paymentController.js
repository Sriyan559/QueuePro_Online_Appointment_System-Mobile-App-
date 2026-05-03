const Payment = require('../models/Payment');
const PaymentMethod = require('../models/PaymentMethod');

// @desc    Make a payment
// @route   POST /api/payments
// @access  Private
const makePayment = async (req, res) => {
    const { amount, type } = req.body;

    const payment = new Payment({
        customerId: req.user._id,
        amount,
        type,
        status: 'Completed', // For simulation, marking as completed immediately
        transactionId: 'TXN_' + Date.now(),
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
};

// @desc    Get user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res) => {
    const payments = await Payment.find({ customerId: req.user._id });
    res.json(payments);
};

// @desc    Update payment status (from a payment gateway webhook or admin)
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = async (req, res) => {
    const { status } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (payment) {
        payment.status = status || payment.status;
        const updatedPayment = await payment.save();
        res.json(updatedPayment);
    } else {
        res.status(404).json({ message: 'Payment not found' });
    }
};

// @desc    Add a payment method
// @route   POST /api/payments/methods
// @access  Private
const addPaymentMethod = async (req, res) => {
    const { type, last4, cardHolder, expiry } = req.body;

    const method = new PaymentMethod({
        customerId: req.user._id,
        type,
        last4,
        cardHolder,
        expiry,
    });

    const createdMethod = await method.save();
    res.status(201).json(createdMethod);
};

// @desc    Get user's payment methods
// @route   GET /api/payments/methods
// @access  Private
const getMyPaymentMethods = async (req, res) => {
    const methods = await PaymentMethod.find({ customerId: req.user._id });
    res.json(methods);
};

module.exports = {
    makePayment,
    getMyPayments,
    updatePayment,
    addPaymentMethod,
    getMyPaymentMethods,
};
