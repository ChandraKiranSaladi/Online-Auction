const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({

    items: [{ itemId: { type: String, required: true}}],
    itemNumbers : { type: Number, default: 4},
    date: { type: Date, required: true, unique: true},
    time: { 
            start:{ type: Date, default: "8:00:00am"},
            end:{ type: Date, default: "8:04:00am"}
          },
    slotDuration: { type: Number, default: 1}
});


module.exports = mongoose.model('Schedule',scheduleSchema);