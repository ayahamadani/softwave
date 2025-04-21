const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  isAdmin: Boolean,
  icon: {
    type: String,
    default: "https://my-songs-bucket443181317692.s3.eu-north-1.amazonaws.com/user-icons/catee.jpg"
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;