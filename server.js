const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Reservation = require('./models/reservationModel');
const CityHotel = require('./models/cityHotelModel');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('DB connection successful!');

    const reservations = await Reservation.find({
      checkOutDate: { $lte: Date.now() },
      status: { $ne: 'Closed' }
    });
    if (reservations) {
      reservations.forEach(async (reservation) => {
        await Reservation.findByIdAndUpdate(
          reservation.id,
          { status: 'Closed' },
          { new: true, runValidators: false }
        );
        await CityHotel.findByIdAndUpdate(reservation.cityHotel.id, {
          singleRooms:
            reservation.cityHotel.singleRooms + reservation.numberOfSingleRooms,
          doubleRooms:
            reservation.cityHotel.doubleRooms + reservation.numberOfDoubleRooms,
          tripleRooms:
            reservation.cityHotel.tripleRooms + reservation.numberOfTripleRooms
        });
      });
    }
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
