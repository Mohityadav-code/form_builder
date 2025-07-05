const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: String,
  type: String,
  label: String,
  placeholder: String,
  required: Boolean,
  options: [String]
});

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fields: [fieldSchema],
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

module.exports = mongoose.model('Form', formSchema);
