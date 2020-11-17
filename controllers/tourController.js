const Tour = require('../models/tourModel');
const QueryBuilder = require('../utils/QueryBuilder');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage -ratingsQuantity price -duration';
  req.query.fields = 'name,duration,difficulty,ratingsAverage,price,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    //----------------------------------------------------------
    const queryBuilder = new QueryBuilder(req.query, Tour);
    const query = queryBuilder.filter().sort().limitFields().paginate().dbQuery;

    // EXECUTE QUERY
    //----------------------------------------------------------
    const tours = await query;

    // SEND RESPONSE
    //----------------------------------------------------------
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.toursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          totalTours: { $sum: 1 },
          totalRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgRating: -1 } },
    ]);
    res.status(200).json({ status: 'success', data: stats });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.monthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}/01/01`),
            $lte: new Date(`${year}/12/31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          totalTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $sort: { totalTours: -1 } },
      { $project: { _id: 0 } },
    ]);

    res
      .status(200)
      .json({ status: 'success', results: plan.length, data: plan });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
