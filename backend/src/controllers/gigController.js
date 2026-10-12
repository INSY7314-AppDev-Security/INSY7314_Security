const Gig = require('../models/Gig');
const { stripHtml } = require('../utils/sanitize');

// Only these fields may ever be set from the request body.
// "freelancer" is deliberately NOT here: it always comes from the JWT.
const ALLOWED_FIELDS = ['title', 'description', 'price', 'category', 'isAvailable'];

function pickAllowed(source) {
  const data = {};
  for (const key of ALLOWED_FIELDS) {
    if (source && source[key] !== undefined) {
      data[key] = source[key];
    }
  }
  return data;
}

function gigNotFound(res) {
  // The same 404 whether the gig does not exist or belongs to someone else,
  // so an attacker cannot use the API to find out which ids exist.
  return res.status(404).json({ success: false, message: 'Gig not found' });
}

// POST /api/gigs  (freelancer)
async function createGig(req, res, next) {
  try {
    const data = pickAllowed(req.body);
    const gig = await Gig.create({ ...data, freelancer: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/gigs  (client, admin)
// Clients only see available gigs. Admins see every gig.
async function getGigs(req, res, next) {
  try {
    const filter = {};

    if (req.user.role === 'client') {
      filter.isAvailable = true;
    }

    if (typeof req.query.category === 'string' && req.query.category.length > 0) {
      filter.category = stripHtml(req.query.category);
    }

    const gigs = await Gig.find(filter).sort({ createdAt: -1 }).limit(100);

    res.status(200).json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    next(error);
  }
}

// GET /api/gigs/mine  (freelancer)
async function getMyGigs(req, res, next) {
  try {
    const gigs = await Gig.find({ freelancer: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    next(error);
  }
}

// GET /api/gigs/:id  (client, freelancer, admin)
async function getGigById(req, res, next) {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === 'client') {
      filter.isAvailable = true;
    } else if (req.user.role === 'freelancer') {
      filter.freelancer = req.user.id;
    }
    // admin: no extra restriction

    const gig = await Gig.findOne(filter);
    if (!gig) return gigNotFound(res);

    res.status(200).json({ success: true, gig });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/gigs/:id  (freelancer, own gigs only)
async function updateGig(req, res, next) {
  try {
    const updates = pickAllowed(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one field to update'
      });
    }

    // Ownership is part of the database query itself
    const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return gigNotFound(res);

    gig.set(updates);
    await gig.save();

    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      gig
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/gigs/:id  (freelancer: own gigs only, admin: any gig)
async function deleteGig(req, res, next) {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === 'freelancer') {
      filter.freelancer = req.user.id;
    }

    const result = await Gig.deleteOne(filter);
    if (result.deletedCount === 0) return gigNotFound(res);

    res.status(200).json({ success: true, message: 'Gig deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGig, getGigs, getMyGigs, getGigById, updateGig, deleteGig };