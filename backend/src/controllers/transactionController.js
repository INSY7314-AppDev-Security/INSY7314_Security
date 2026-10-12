const Transaction = require('../models/Transaction');

// Client: payments they made. Freelancer: payments they received. Admin: all.
function visibilityFilter(user) {
  if (user.role === 'client') return { client: user.id };
  if (user.role === 'freelancer') return { freelancer: user.id };
  return {}; // admin
}

// GET /api/transactions  (client, freelancer, admin)
async function getTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find(visibilityFilter(req.user))
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
}

// GET /api/transactions/:id  (only if you are the client, the freelancer, or an admin)
async function getTransactionById(req, res, next) {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      ...visibilityFilter(req.user)
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
}

module.exports = { getTransactions, getTransactionById };
