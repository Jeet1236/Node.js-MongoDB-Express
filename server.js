/* eslint-disable prettier/prettier */
const port = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(`${err.name} + ${err.message}`);
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    UseCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

const app = require('./app');

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`${err.name} + ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
