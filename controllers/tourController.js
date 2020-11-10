// const fs = require('fs');
// const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkBody = (req, res, next) => {
  const { body } = req;
  if (!(body.name && body.price)) {
    return res.status(400).json({ status: 'fail', message: 'invalid data' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.createNewTour = (req, res) => {
  res.status(201).json({
    status: 'success',
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({ status: 'success' });
};
