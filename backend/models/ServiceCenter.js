const mongoose = require('mongoose');

const serviceCenterSchema = mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceCenter', serviceCenterSchema);
