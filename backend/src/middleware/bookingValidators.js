const { body, param } = require('express-validator');

// Booking a gig: the client only sends the gig id.
// Price, client and freelancer are NOT accepted from the request, the server
// takes them from the gig and from the JWT.
// isString() rejects objects/arrays such as { "$ne": null } (NoSQL injection).
const createBookingRules = [
  body('gigId')
    .isString().withMessage('gigId is required and must be text').bail()
    .trim()
    .isMongoId().withMessage('gigId is not a valid id')
];

// Used by every "/:id" route on bookings and transactions
const idRule = [
  param('id').isMongoId().withMessage('Invalid id')
];

module.exports = { createBookingRules, idRule };
