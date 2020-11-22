'use strict';

const mongoose = require('mongoose');

const todo = new mongoose.Schema({
  item: { type: String, required: true },
  assignee: { type: String, required: true },
  difficulty: { type: Number, required: true },
  complete: { type: Boolean, required: true },
});

module.exports = mongoose.model('todo', todo);
