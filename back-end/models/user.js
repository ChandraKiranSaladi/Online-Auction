const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    }
  },
  hash: {
    type: String,
    required: true
  },
  role: String,
  created: {
    type: Date,
    default: Date.now
  },
  lastActivity: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('User', userSchema);