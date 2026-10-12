const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot be longer than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot be longer than 1000 characters']
    },
    // Price in South African Rand (ZAR)
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot be longer than 50 characters']
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    // The freelancer who owns this gig. Set from the JWT, never from the request body.
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gig', gigSchema);