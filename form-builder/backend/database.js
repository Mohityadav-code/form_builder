// Mock database for forms. In the future, replace with MongoDB logic.
let forms = [
  {
    id: 1,
    name: 'Contact Form',
    description: 'Basic contact form with name, email, and message',
    fields: [
      { id: 1, type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
      { id: 2, type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
      { id: 3, type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Survey Form',
    description: 'Customer satisfaction survey',
    fields: [
      { id: 1, type: 'text', label: 'Name', placeholder: 'Your name', required: true },
      { id: 2, type: 'select', label: 'Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true }
    ],
    createdAt: '2024-01-20'
  }
];

function getForms() {
  // Return only form metadata (not full config)
  return forms.map(({ id, name, description, createdAt }) => ({ id, name, description, createdAt }));
}

function getFormById(id) {
  return forms.find(f => f.id == id);
}

function addForm(form) {
  forms.push(form);
}

function updateFormById(id, updated) {
  const idx = forms.findIndex(f => f.id == id);
  if (idx !== -1) {
    forms[idx] = { ...forms[idx], ...updated, id: forms[idx].id };
    return forms[idx];
  }
  return null;
}

function deleteFormById(id) {
  const idx = forms.findIndex(f => f.id == id);
  if (idx !== -1) {
    forms.splice(idx, 1);
    return true;
  }
  return false;
}

module.exports = {
  getForms,
  getFormById,
  addForm,
  updateFormById,
  deleteFormById
};
