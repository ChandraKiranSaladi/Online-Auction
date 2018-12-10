const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

  title: { type: String, required: true },
  photo: String,
  content: { type: String, required: true },
  initialBidPrice: { type: Number, required: true },
  date: { type: String, required: true },
  time: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  created: {
    type: String,
    default: new Date().toString()
  },
  userId: { type: String, required: true },
  imagePath: { type: String, required: true }
})

module.exports = mongoose.model('Item', itemSchema);