const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: String,
  type: String,
  label: String,
  placeholder: String,
  required: Boolean,
  options: [String],
  helperText: String,
  validation: {
    min: String,
    max: String,
    minLength: String,
    maxLength: String,
    pattern: String
  }
});

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fields: [fieldSchema],
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

module.exports = mongoose.model('Form', formSchema);
