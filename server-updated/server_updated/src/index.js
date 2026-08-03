const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pdfRoutes = require('./routes/pdf.routes');
const ragRoutes = require('./routes/rag.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/rag', ragRoutes);

// Base route for health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'RAG MERN Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
