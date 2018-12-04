const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

    title: { type: String, required: true },
    photo: String,
    content: { type: String, required: true},
    initialBidPrice: { type: Number, required: true},
    date: {type: Date, required: true },
    time: { 
        start:{ type: Number, required: true},
        end:{ type: Number, required: true}
      },
    created: {
        type: Date,
        default: Date.now
      },
    userId : {type: String, required: true},
    imagePath: { type: String, required: true}
}) 

module.exports = mongoose.model('Item',itemSchema);