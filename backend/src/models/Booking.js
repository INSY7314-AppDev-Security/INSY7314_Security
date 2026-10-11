const mongoose = require('mongoose');

// A Booking is a client hiring a freelancer's gig.
// Client, freelancer and amount are always set by the server (from the JWT
// and from the gig itself), never from the request body.
const bookingSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true
    },
    // Copied from the gig at booking time so the booking still makes sense
    // if the freelancer later edits or deletes the gig.
    gigTitle: {
      type: String,
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // The price the client agreed to pay (ZAR), frozen at booking time
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than zero']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
