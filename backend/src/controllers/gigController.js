const Gig = require('../models/Gig');

exports.createGig = async (req, res) => {
  try {
    const gig = await Gig.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      freelancer: req.user.id
    });
    res.status(201).json({ success: true, message: 'Gig created successfully', gig });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ isAvailable: true });
    res.json({ success: true, gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};