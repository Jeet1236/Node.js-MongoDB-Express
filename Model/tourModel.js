/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: 40,
      minlength: 5,

      // Using the custom validation by importing the module
      // validate: {
      //   validator: validator.isAlpha,
      //   message: 'The name should not contain any number',
      // },
    },
    rating: {
      type: Number,
      max: [5, 'The rating cannot be greater than 5'],
      min: [0, 'The rating cannot be lesser than 0'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],

      // CUSTOM VALIDATORS
      // validate: {
      //   validator: function (price) {
      //     return price > this.rating;
      //   },
      //   message:
      //     'The value of price should be greater than the value of ratings. I know that is very strange.',
      // },
    },
    duration: {
      type: String,
      required: [true, 'Must have the duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'The maximum size of the group should be defined'],
    },
    summary: {
      type: String,
      trim: true,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      max: [5, 'The rating average cannot be greater than 5'],
      min: [0, 'The rating average cannot be lesser than 0'],
      // set: (val) => Math.round(val * 10),
    },
    difficulty: {
      type: String,
      required: [true, 'Must have the level of difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty can be:easy,medium or difficult',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have the cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      selected: false,
    },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
    slug: String,
    startLocation: {
      // GEOJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Setting the index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//VIRTAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // The field which is there to be referred in Review model
  localField: '_id', // the value of the foreignField
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATE MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secretTour: { $ne: true },
//     },
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
