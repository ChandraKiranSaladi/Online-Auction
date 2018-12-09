const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

    title: { type: String, required: true },
    photo: String,
    content: { type: String, required: true},
    initialBidPrice: { type: Number, required: true},
    date: {type: Date, required: true },
    time: { 
        start:{ type: Date, required: true},
        end:{ type: Date, required: true}
      },
    created: {
        type: Date,
        default: Date.now
      },
    userId : {type: String, required: true},
    imagePath: { type: String, required: true}
}) 

module.exports = mongoose.model('Item',itemSchema);