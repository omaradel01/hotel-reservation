const mongoose = require('mongoose');

const cityHotelSchema = new mongoose.Schema(
  {
    name: String,
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: true
    },
    priceOfNight: {
      type: Number,
      required: [true, 'Please provide the price of the night!']
    },
    distance: Number,
    singleImage: {
      type: String,
      default: ''
    },
    images: [String],
    mapLocation: {
      type: String,
      required: [true, 'Please provide the location of the Hotel!']
    },
    singleRooms: {
      type: Number,
      min: 0,
      max: 10,
      default: 10
    },
    doubleRooms: {
      type: Number,
      min: 0,
      max: 10,
      default: 10
    },
    tripleRooms: {
      type: Number,
      min: 0,
      max: 10,
      default: 10
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

cityHotelSchema.index({ city: 1, hotel: 1 }, { unique: true });

cityHotelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'hotel'
  }).populate({
    path: 'city'
  });
  next();
});

const CityHotel = mongoose.model('CitiesHotels', cityHotelSchema);

module.exports = CityHotel;
