const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createGig, getGigs } = require('../controllers/gigController');

router.get('/', getGigs);
router.post('/', protect, createGig);

module.exports = router;