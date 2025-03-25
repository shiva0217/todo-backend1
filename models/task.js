// models/Task.js
const mongoose = require('mongoose');
const User = require('./user');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: { type: String, required: true }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
