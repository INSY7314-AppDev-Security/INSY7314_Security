const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { handleValidationErrors } = require('../middleware/validators');
const {
  createGigRules,
  updateGigRules,
  gigIdRule,
  browseGigRules
} = require('../middleware/gigValidators');
const {
  createGig,
  getGigs,
  getMyGigs,
  getGigById,
  updateGig,
  deleteGig
} = require('../controllers/gigController');

// Every gig route needs a valid JWT
router.use(protect);

// Browse gigs: clients (available only) and admins (all)
router.get('/', authorizeRoles('client', 'admin'), browseGigRules, handleValidationErrors, getGigs);

// A freelancer's own gigs. Must be registered BEFORE '/:id'
router.get('/mine', authorizeRoles('freelancer'), getMyGigs);

// Create a gig
router.post('/', authorizeRoles('freelancer'), createGigRules, handleValidationErrors, createGig);

// View one gig
router.get('/:id', authorizeRoles('client', 'freelancer', 'admin'), gigIdRule, handleValidationErrors, getGigById);

// Update own gig
router.patch('/:id', authorizeRoles('freelancer'), updateGigRules, handleValidationErrors, updateGig);

// Delete a gig (freelancer: own, admin: any)
router.delete('/:id', authorizeRoles('freelancer', 'admin'), gigIdRule, handleValidationErrors, deleteGig);

module.exports = router;