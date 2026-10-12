const Gig = require('../models/Gig');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

function bookingNotFound(res) {
  // Same 404 whether the booking does not exist or belongs to someone else,
  // so the API never confirms which ids exist.
  return res.status(404).json({ success: false, message: 'Booking not found' });
}

// Who is allowed to see a booking: the client who made it, the freelancer
// who was booked, or an admin.
function visibilityFilter(user) {
  if (user.role === 'client') return { client: user.id };
  if (user.role === 'freelancer') return { freelancer: user.id };
  return {}; // admin
}

// POST /api/bookings  (client)
// Books a gig and creates the matching transaction.
async function createBooking(req, res, next) {
  try {
    // Only gigs that exist AND are available can be booked
    const gig = await Gig.findOne({ _id: req.body.gigId, isAvailable: true });
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or not available'
      });
    }

    // Client comes from the JWT. Freelancer and amount come from the gig.
    const booking = await Booking.create({
      gig: gig._id,
      gigTitle: gig.title,
      client: req.user.id,
      freelancer: gig.freelancer,
      amount: gig.price
    });

    // Every booking must have a transaction. MongoDB transactions need a
    // replica set, so if this second write fails we undo the booking by hand.
    let transaction;
    try {
      transaction = await Transaction.create({
        booking: booking._id,
        gig: gig._id,
        gigTitle: gig.title,
        client: booking.client,
        freelancer: booking.freelancer,
        amount: booking.amount
      });
    } catch (txError) {
      await Booking.deleteOne({ _id: booking._id });
      throw txError;
    }

    res.status(201).json({
      success: true,
      message: 'Gig booked successfully',
      booking,
      transaction
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings  (client, freelancer, admin)
// Client: bookings they made. Freelancer: bookings of their gigs. Admin: all.
async function getBookings(req, res, next) {
  try {
    const bookings = await Booking.find(visibilityFilter(req.user))
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings/:id  (client, freelancer, admin: only if they are involved)
async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      ...visibilityFilter(req.user)
    });
    if (!booking) return bookingNotFound(res);

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
}

module.exports = { createBooking, getBookings, getBookingById };
