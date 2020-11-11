const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Group size required'],
  },
  difficulty: {
    type: String,
    required: [true, 'Dificulty required'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Price required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Summary required'],
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Image cover required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
