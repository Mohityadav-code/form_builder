const API_URL = 'http://localhost:5050/api';

export async function getForms() {
  const res = await fetch(`${API_URL}/forms`);
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function getFormById(id) {
  const res = await fetch(`${API_URL}/forms/${id}`);
  if (!res.ok) throw new Error('Form not found');
  return res.json();
}

// Public endpoint for accessing forms without exposing all forms
export async function getPublicFormById(id) {
  const res = await fetch(`${API_URL}/public/forms/${id}`);
  if (!res.ok) throw new Error('Form not found');
  return res.json();
}

export async function createForm(form) {
  const res = await fetch(`${API_URL}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
}

export async function updateForm(id, form) {
  const res = await fetch(`${API_URL}/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  if (!res.ok) throw new Error('Failed to update form');
  return res.json();
}

export async function deleteForm(id) {
  const res = await fetch(`${API_URL}/forms/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete form');
  return res.json();
}

export async function submitForm(formId, data) {
  // Use the public endpoint for form submissions
  const res = await fetch(`${API_URL}/public/forms/${formId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit form');
  return res.json();
}

export async function getFormSubmissions(formId) {
  const res = await fetch(`${API_URL}/forms/${formId}/submissions`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
} 