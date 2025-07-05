const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const formRoutes = require('./routes/formRoutes');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection is handled in database.js
// This ensures the connection is established before routes are used
require('./database');

// Routes
app.use('/api', formRoutes);

// Start server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
