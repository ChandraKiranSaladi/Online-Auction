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
    type: String,
    default: new Date().toString()
  },
  lastActivity: String,
  resetPasswordToken: String,
  resetPasswordExpires: String
});

module.exports = mongoose.model('User', userSchema);