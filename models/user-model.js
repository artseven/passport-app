const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  // 1st arg -> fields of documents of this collection
  {
    name: { type: String },
    username: { type: String },
    encryptedPassword: { type: String }
  },
    //2nd arg -> additional options
  {
    // Adds "createdAt" and "updatedAt" fields
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
