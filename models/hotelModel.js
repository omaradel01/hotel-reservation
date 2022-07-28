const mongoose = require('mongoose');
const slugify = require('slugify');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Hotel must have a name'],
      unique: true
    },
    stars: {
      type: Number,
      required: [true, 'A Hotel must have stars.'],
      min: 1,
      max: 5
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    numRatings: Number,
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

hotelSchema.index({ slug: 1 });

hotelSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
