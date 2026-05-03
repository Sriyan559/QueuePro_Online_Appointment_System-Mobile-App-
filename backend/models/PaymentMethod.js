const mongoose = require('mongoose');

const paymentMethodSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['Visa', 'Mastercard', 'Amex', 'Wallet'],
        required: true,
    },
    last4: {
        type: String,
        required: true,
    },
    cardHolder: {
        type: String,
        required: true,
    },
    expiry: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
