const mongoose = require('mongoose');

const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const validate = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please Enter Your Email'],
    unique: true,
    lowercase: true,
    validate: [validate.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please Enter your password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your password}'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords doesnt match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  canidatePassword,
  userPassword,
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
