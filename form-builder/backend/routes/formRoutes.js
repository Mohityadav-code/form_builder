const express = require('express');
const router = express.Router();
const { getForms, getFormById, addForm, updateFormById, deleteFormById, addSubmission, getSubmissions } = require('../database');
const Form = require('../models/form');

// Get all forms (metadata only) - PROTECTED, should not be accessible publicly
router.get('/forms', async (req, res) => {
  try {
    const forms = await getForms();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get form details by id - PROTECTED, should not be accessible publicly
router.get('/forms/:id', async (req, res) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// PUBLIC endpoint - Get form by ID for public access
// This endpoint is specifically for public form viewing/submission
router.get('/public/forms/:id', async (req, res) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Add a new form
router.post('/forms', async (req, res) => {
  try {
    // Validate required fields
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Create the form
    const form = await addForm(req.body);
    if (!form) return res.status(400).json({ error: 'Failed to create form' });
    res.status(201).json(form);
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Update a form by id
router.put('/forms/:id', async (req, res) => {
  try {
    const updated = await updateFormById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Form not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update form' });
  }
});

// Delete a form by id
router.delete('/forms/:id', async (req, res) => {
  try {
    const success = await deleteFormById(req.params.id);
    if (!success) return res.status(404).json({ error: 'Form not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

// Submit a filled form - PROTECTED route
router.post('/forms/:id/submit', async (req, res) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    
    const submission = await addSubmission(req.params.id, req.body);
    if (!submission) return res.status(400).json({ error: 'Failed to submit form' });
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// PUBLIC endpoint - Submit a filled form
router.post('/public/forms/:id/submit', async (req, res) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    
    const submission = await addSubmission(req.params.id, req.body);
    if (!submission) return res.status(400).json({ error: 'Failed to submit form' });
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all submissions for a form
router.get('/forms/:id/submissions', async (req, res) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    
    const submissions = await getSubmissions(req.params.id);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
