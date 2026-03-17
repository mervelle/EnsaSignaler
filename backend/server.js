require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const signalementsRoutes = require('./routes/signalements');
app.use('/signalements', signalementsRoutes);

// test route
app.get('/', (req, res) => {
    res.send("API EnsaSignaler en ligne 🚀");
});

// start server
app.listen(3000, () => {
    console.log("🚀 Serveur sur http://localhost:3000");
});