const mongoose = require('mongoose');

const queueParticipationSchema = mongoose.Schema({
    queueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Queue',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    tokenNumber: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Waiting', 'Serving', 'Completed', 'Cancelled'],
        default: 'Waiting',
    }
}, { timestamps: true });

module.exports = mongoose.model('QueueParticipation', queueParticipationSchema);
