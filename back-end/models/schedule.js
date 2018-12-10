const mongoose = require('mongoose');
const moment = require('moment');

const scheduleSchema = mongoose.Schema({

    items: [{ itemId: { type: String, required: true } }],
    itemNumbers: { type: Number, default: 4 },
    date: { type: String, required: true, unique: true },
    time: {
        start: { type: String, default: "08:00:00" },
        end: { type: String, default: "08:04:00" }
    },
    slotDuration: { type: Number, default: 1 }
});


module.exports = mongoose.model('Schedule', scheduleSchema);