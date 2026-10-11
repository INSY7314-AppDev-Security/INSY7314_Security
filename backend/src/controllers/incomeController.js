const Transaction = require('../models/Transaction');

// Amounts are stored with at most 2 decimals. Adding decimals in JavaScript
// can leave tiny errors (0.1 + 0.2), so round every total to cents.
function toRand(value) {
  return Math.round(value * 100) / 100;
}

// GET /api/income  (freelancer)
// Shows the logged-in freelancer's bookings and the money earned from them.
// The freelancer id always comes from the JWT, so nobody can ask for
// somebody else's income.
async function getIncome(req, res, next) {
  try {
    // Newest first, so the first transaction we see for a gig has its latest title
    const transactions = await Transaction.find({
      freelancer: req.user.id,
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .lean();

    // Total earned across every booking
    const totalEarned = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Earnings per gig
    const perGig = new Map();
    for (const t of transactions) {
      const key = String(t.gig);
      if (!perGig.has(key)) {
        perGig.set(key, { gig: t.gig, gigTitle: t.gigTitle, bookings: 0, earned: 0 });
      }
      const entry = perGig.get(key);
      entry.bookings += 1;
      entry.earned += t.amount;
    }

    const byGig = [...perGig.values()]
      .map((g) => ({ ...g, earned: toRand(g.earned) }))
      .sort((a, b) => b.earned - a.earned);

    res.status(200).json({
      success: true,
      currency: 'ZAR',
      totalEarned: toRand(totalEarned),
      totalBookings: transactions.length,
      byGig,
      // The 100 most recent bookings with the money earned from each
      bookings: transactions.slice(0, 100).map((t) => ({
        booking: t.booking,
        transaction: t._id,
        reference: t.reference,
        gigTitle: t.gigTitle,
        client: t.client,
        amount: t.amount,
        date: t.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getIncome };
