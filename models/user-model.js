const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  // 1st arg -> fields of documents of this collection
  {
    // All users
    name: { type: String },
    role: {
       type: String,
       enum: [ 'normal user', 'admin'],
       default: 'normal user'
    },
    // Traditional registration users
    username: { type: String },
    encryptedPassword: { type: String },
    photoAddress: {type: String},

    // Login with Facebook users
    facebookID: { type: String },

    // Login with Google users
    googleID: { type: String}
  },
    //2nd arg -> additional options
  {
    // Adds "createdAt" and "updatedAt" fields
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
