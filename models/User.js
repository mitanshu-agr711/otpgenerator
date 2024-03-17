const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  bio: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  newpassword:{
    type: String,
    required: false,
  },
});



const User = mongoose.model('User', userSchema);

module.exports = User;
