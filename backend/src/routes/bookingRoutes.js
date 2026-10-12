const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { bookingLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validators');
const { createBookingRules, idRule } = require('../middleware/bookingValidators');
const {
  createBooking,
  getBookings,
  getBookingById
} = require('../controllers/bookingController');

// Every booking route needs a valid JWT
router.use(protect);

// Book a gig. Clients only. Rate limited.
router.post(
  '/',
  authorizeRoles('client'),
  bookingLimiter,
  createBookingRules,
  handleValidationErrors,
  createBooking
);

// List bookings (scoped to the logged-in user, admin sees all)
router.get('/', authorizeRoles('client', 'freelancer', 'admin'), getBookings);

// View one booking (only if you are involved in it, or admin)
router.get('/:id', authorizeRoles('client', 'freelancer', 'admin'), idRule, handleValidationErrors, getBookingById);

module.exports = router;
