const mongoose = require('mongoose');
const slugify = require('slugify');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A City must have a name.'],
      unique: true
    },
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

citySchema.index({ slug: 1 });

citySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const City = mongoose.model('City', citySchema);

module.exports = City;
