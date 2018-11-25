const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

    title: String,
    photo: String,
    description: String,
    caption: String,
    initialBidPrice: Number,
    auctionDateTime: Date
    
}) 

module.exports = mongoose.model('Item',itemSchema);