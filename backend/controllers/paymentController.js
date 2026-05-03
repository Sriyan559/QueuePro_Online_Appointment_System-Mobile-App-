const Payment = require('../models/Payment');

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
    res.status(214).json(createdPayment);
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

module.exports = {
    makePayment,
    getMyPayments,
    updatePayment,
};
