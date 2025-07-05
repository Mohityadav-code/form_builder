const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  submittedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

module.exports = mongoose.model('Submission', submissionSchema); 