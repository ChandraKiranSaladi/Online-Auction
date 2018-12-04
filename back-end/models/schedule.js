const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({

    items: [{ itemId: { type: String, required: true}}],
    itemNumbers : { type: Number, default: 3},
    date: { type: Date, required: true, unique: true},
    time: { 
            start:{ type: Number, default: 8},
            end:{ type: Date, default: 11}
            
          },
    slotDuration: { type: Number, default: 1}
});


module.exports = mongoose.model('Schedule',scheduleSchema);