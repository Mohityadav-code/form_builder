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