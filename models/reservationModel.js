const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A reservation must belong to a user!']
    },
    cityHotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'CitiesHotels',
      required: [true, 'A reservation must belong to a user!']
    },
    type: {
      type: String,
      enum: ['Full Board', 'Half Board', 'Bed and Breakfast'],
      required: [true, 'A Reservation must have a type']
    },
    checkInDate: {
      type: Date,
      required: [true, 'A reservation must have a check in date!'],
      validate: {
        validator: function (el) {
          return el >= Date.now;
        },
        message:
          'The check in date must be at least the same as or after today!'
      }
    },
    checkOutDate: {
      type: Date,
      required: [true, 'A reservation must have a check out date!'],
      validate: {
        validator: function (el) {
          return el >= this.checkInDate;
        },
        message:
          'The check out date must be at least the same as or after the check in date!'
      }
    },
    price: {
      type: Number,
      required: [true, 'A reservation must have a price!']
    },
    numberOfAdults: {
      type: Number,
      required: [true, 'Please provide the number of adults!']
    },
    numberOfChildren: {
      type: Number,
      default: 0
    },
    numberOfSingleRooms: {
      type: Number,
      default: 0
    },
    numberOfDoubleRooms: {
      type: Number,
      default: 0
    },
    numberOfTripleRooms: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Started', 'Canceled', 'Closed'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reservationSchema.pre(/^find/, function (next) {
  this.populate({ path: 'cityHotel', select: 'name' }).populate({
    path: 'user',
    select: 'firstName lastName email'
  });
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
