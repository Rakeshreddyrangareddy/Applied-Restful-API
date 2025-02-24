const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donationsRoutes = require('./routes/donations');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/donations', donationsRoutes);

mongoose.connect('mongodb://localhost:27017/blooddonations', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((err) => console.error(err));