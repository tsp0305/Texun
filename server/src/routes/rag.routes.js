const express = require('express');
const router = express.Router();
const ragController = require('../controllers/rag.controller');

// POST /api/rag/generate
router.post('/generate', ragController.generateBlog);

module.exports = router;
