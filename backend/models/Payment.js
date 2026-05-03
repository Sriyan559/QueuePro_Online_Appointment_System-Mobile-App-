const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['Appointment', 'Service', 'CenterRegistration'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
