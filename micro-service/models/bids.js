const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    bidPrice: {
        type: Number,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bids', bidSchema);