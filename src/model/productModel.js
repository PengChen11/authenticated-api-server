'use strict';

const mongoose = require('mongoose');

const product = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true},
  img: {type: String},
});

module.exports = mongoose.model('product', product);
