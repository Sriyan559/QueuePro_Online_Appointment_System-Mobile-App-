const mongoose = require('mongoose');

const queueSchema = mongoose.Schema({
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ServiceCenter',
    },
    name: {
        type: String,
        required: true,
    },
    currentToken: {
        type: Number,
        default: 0,
    },
    issuedTokens: {
        type: Number,
        default: 0,
    },
    maxTokens: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    }
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
