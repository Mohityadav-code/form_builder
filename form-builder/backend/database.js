const mongoose = require('mongoose');
const Form = require('./models/form');
const Submission = require('./models/submission');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/form_builder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Seed initial data if database is empty
async function seedInitialData() {
  const count = await Form.countDocuments();
  if (count === 0) {
    const initialForms = [
      {
        name: 'Contact Form',
        description: 'Basic contact form with name, email, and message',
        fields: [
          { id: '1', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
          { id: '2', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
          { id: '3', type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false }
        ]
      },
      {
        name: 'Survey Form',
        description: 'Customer satisfaction survey',
        fields: [
          { id: '1', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
          { id: '2', type: 'select', label: 'Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true }
        ]
      }
    ];

    try {
      await Form.insertMany(initialForms);
      console.log('Initial forms seeded successfully');
    } catch (err) {
      console.error('Error seeding initial data:', err);
    }
  }
}

// Call seed function after connection is established
mongoose.connection.once('open', seedInitialData);

// Form operations
async function getForms() {
  try {
    const forms = await Form.find({}, { fields: 0 });
    const formsList = await Promise.all(forms.map(async (form) => {
      const filledCount = await getSubmissionCount(form._id);
      return {
        id: form._id,
        name: form.name,
        description: form.description,
        createdAt: form.createdAt,
        filledCount
      };
    }));
    return formsList;
  } catch (err) {
    console.error('Error getting forms:', err);
    return [];
  }
}

async function getFormById(id) {
  try {
    // Handle potential MongoDB ObjectId validation issues
    let form;
    try {
      form = await Form.findById(id);
    } catch (err) {
      console.error('Invalid form ID format:', err);
      return null;
    }
    
    if (!form) {
      return null;
    }
    
    return {
      id: form._id,
      name: form.name,
      description: form.description,
      fields: form.fields,
      createdAt: form.createdAt
    };
  } catch (err) {
    console.error('Error getting form by ID:', err);
    return null;
  }
}

async function addForm(form) {
  try {
    // Validate required fields
    if (!form.name || !form.description) {
      console.error('Form validation failed: missing name or description');
      return null;
    }
    
    // Ensure fields is at least an empty array
    if (!form.fields) {
      form.fields = [];
    }
    
    const newForm = new Form(form);
    await newForm.save();
    return {
      id: newForm._id,
      name: newForm.name,
      description: newForm.description,
      fields: newForm.fields,
      createdAt: newForm.createdAt
    };
  } catch (err) {
    console.error('Error adding form:', err);
    return null;
  }
}

async function updateFormById(id, updated) {
  try {
    // Handle potential MongoDB ObjectId validation issues
    let form;
    try {
      form = await Form.findByIdAndUpdate(
        id, 
        updated, 
        { new: true }
      );
    } catch (err) {
      console.error('Invalid form ID format or update error:', err);
      return null;
    }
    
    if (!form) {
      return null;
    }
    
    return {
      id: form._id,
      name: form.name,
      description: form.description,
      fields: form.fields,
      createdAt: form.createdAt
    };
  } catch (err) {
    console.error('Error updating form:', err);
    return null;
  }
}

async function deleteFormById(id) {
  try {
    let result;
    try {
      result = await Form.findByIdAndDelete(id);
      
      // Also delete all submissions for this form
      if (result) {
        await Submission.deleteMany({ formId: id });
      }
    } catch (err) {
      console.error('Invalid form ID format:', err);
      return false;
    }
    
    return !!result;
  } catch (err) {
    console.error('Error deleting form:', err);
    return false;
  }
}

// Submission operations
async function addSubmission(formId, data) {
  try {
    // Validate that the form exists first
    const formExists = await Form.exists({ _id: formId });
    if (!formExists) {
      console.error('Cannot add submission: form does not exist');
      return null;
    }
    
    const submission = new Submission({ formId, data });
    await submission.save();
    return {
      id: submission._id,
      formId: submission.formId,
      data: submission.data,
      submittedAt: submission.submittedAt
    };
  } catch (err) {
    console.error('Error adding submission:', err);
    return null;
  }
}

async function getSubmissions(formId) {
  try {
    let submissions;
    try {
      submissions = await Submission.find({ formId });
    } catch (err) {
      console.error('Invalid form ID format:', err);
      return [];
    }
    
    return submissions.map(s => ({
      id: s._id,
      formId: s.formId,
      data: s.data,
      submittedAt: s.submittedAt
    }));
  } catch (err) {
    console.error('Error getting submissions:', err);
    return [];
  }
}

async function getSubmissionCount(formId) {
  try {
    let count;
    try {
      count = await Submission.countDocuments({ formId });
    } catch (err) {
      console.error('Invalid form ID format:', err);
      return 0;
    }
    return count;
  } catch (err) {
    console.error('Error getting submission count:', err);
    return 0;
  }
}

module.exports = {
  getForms,
  getFormById,
  addForm,
  updateFormById,
  deleteFormById,
  addSubmission,
  getSubmissions,
  getSubmissionCount
};
