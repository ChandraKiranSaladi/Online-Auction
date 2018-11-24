const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      hash: String,
      salt: String

    });

module.exports = mongoose.model('User',userSchema);