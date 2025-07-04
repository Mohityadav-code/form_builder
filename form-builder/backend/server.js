const express = require('express');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', formRoutes);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
