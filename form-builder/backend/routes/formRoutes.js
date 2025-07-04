const express = require('express');
const router = express.Router();
const { getForms, getFormById, addForm, updateFormById } = require('../database');
const Form = require('../models/form');

// Get all forms (metadata only)
router.get('/forms', (req, res) => {
  res.json(getForms());
});

// Get form details by id
router.get('/forms/:id', (req, res) => {
  const form = getFormById(req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  res.json(form);
});

// Add a new form
router.post('/forms', (req, res) => {
  const form = new Form({
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString().split('T')[0]
  });
  addForm(form);
  res.status(201).json(form);
});

// Update a form by id
router.put('/forms/:id', (req, res) => {
  const updated = updateFormById(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Form not found' });
  res.json(updated);
});

// Delete a form by id
router.delete('/forms/:id', (req, res) => {
  const idx = require('../database').deleteFormById(req.params.id);
  if (!idx) return res.status(404).json({ error: 'Form not found' });
  res.json({ success: true });
});

module.exports = router;
