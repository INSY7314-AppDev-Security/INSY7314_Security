const mongoose = require('mongoose');
const crypto = require('crypto');

// A Transaction is the (simulated) payment record created by every booking.
// It links the client who paid to the freelancer who earns the money.
// Transactions are a financial ledger: the API only ever creates and reads
// them. There is no update or delete endpoint.
const transactionSchema = new mongoose.Schema(
  {
    // Human readable receipt number, e.g. TXN-9F3A1C7B2E40
    reference: {
      type: String,
      unique: true,
      default: () => `TXN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    },
    // One booking can only ever have one transaction
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true
    },
    // Copied from the gig at booking time so the record stays correct
    // even if the gig is edited or deleted later.
    gigTitle: {
      type: String,
      required: true
    },
    // The client who paid
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // The freelancer who earned the money
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Amount in South African Rand (ZAR), copied from the gig price on the server
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than zero']
    },
    currency: {
      type: String,
      default: 'ZAR',
      enum: ['ZAR']
    },
    // Payment is simulated for this assignment, no real money moves
    paymentMethod: {
      type: String,
      default: 'simulated',
      enum: ['simulated']
    },
    status: {
      type: String,
      default: 'completed',
      enum: ['completed']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
