const Tour = require('../Model/tourModel');

const catchAsync = require('../utils/catchAsync');
const review = require('../Model/reviewModel');
const user = require('../Model/userModel');
const tour = require('../Model/tourModel');

exports.getOverview = catchAsync(async (req, res) => {
  //1) Get tour data from collection
  const tours = await Tour.find();

  //2) Build template
  //3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});
exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', {
    title: 'The forest Hiker Tour',
  });
});
