/* eslint-disable prettier/prettier */
const port = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1234 });

process.on('uncaughtException', (err) => {
  console.log(`${err.name} + ${err.message}`);
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
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
