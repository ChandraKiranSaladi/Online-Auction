const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({

    itemId: { type: String, required: true},
    itemNumbers : { type: Number,required: true},
    date: Date,
    startTime: Number,
    endTime: Number,
    slotDuration: { type: Number, default: 1}
});


module.exports = mongoose.model('Schedule',scheduleSchema);