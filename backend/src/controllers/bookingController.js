const Booking = require('../models/Booking');
const Gig = require('../models/Gig');

exports.createBooking = async (req, res) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    const booking = await Booking.create({
      gig: gig._id,
      client: req.user.id,
      freelancer: gig.freelancer,
      price: gig.price
    });

    res.status(201).json({ success: true, message: 'Booking successful', booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};