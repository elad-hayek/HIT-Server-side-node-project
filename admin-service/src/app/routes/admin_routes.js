const express = require('express');
const adminController = require('../controllers/admin_controller');

const router = express.Router();

// GET /api/about - Get development team information
router.get('/about', adminController.getAbout);

module.exports = router;