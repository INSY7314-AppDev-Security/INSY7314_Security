const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getIncome } = require('../controllers/incomeController');

// A freelancer's own income. Clients and admins get 403.
router.get('/', protect, authorizeRoles('freelancer'), getIncome);

module.exports = router;
