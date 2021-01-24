const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        const urlRegex = /https?:\/\/\S+\.\S+/gm;
        return urlRegex.test(url);
      },
    },
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
