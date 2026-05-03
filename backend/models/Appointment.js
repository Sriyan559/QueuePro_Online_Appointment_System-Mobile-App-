const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ServiceCenter',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
