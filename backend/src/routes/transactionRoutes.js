const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { handleValidationErrors } = require('../middleware/validators');
const { idRule } = require('../middleware/bookingValidators');
const {
  getTransactions,
  getTransactionById
} = require('../controllers/transactionController');

// Transactions are created by bookings, never directly. These routes are read only.
router.use(protect);

router.get('/', authorizeRoles('client', 'freelancer', 'admin'), getTransactions);
router.get('/:id', authorizeRoles('client', 'freelancer', 'admin'), idRule, handleValidationErrors, getTransactionById);

module.exports = router;
