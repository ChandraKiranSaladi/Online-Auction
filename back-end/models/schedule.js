const mongoose = require('mongoose');
const moment = require('moment');

const scheduleSchema = mongoose.Schema({

    items: [{ itemId: { type: String, required: true}}],
    itemNumbers : { type: Number, default: 4},
    date: { type: Date, required: true, unique: true},
    time: { 
            start:{ type: Date, default: moment("8:00:00 am","hh:mm:ss a")},
            end:{ type: Date, default: moment("8:04:00 am","hh:mm:ss a")}
          },
    slotDuration: { type: Number, default: 1}
});


module.exports = mongoose.model('Schedule',scheduleSchema);