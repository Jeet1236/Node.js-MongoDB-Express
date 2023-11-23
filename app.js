/* eslint-disable import/no-dynamic-require */
const express = require('express');
const morgan = require('morgan');
const globalErrorController = require('./Controllers/errorController');
const AppError = require('./utils/appError');

// eslint-disable-next-line import/no-dynamic-require
const userRouter = require(`${__dirname}/routes/userRoutes`);
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const app = express();
app.use(express.static(`${__dirname}/public`));
// Middle wares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Router Handlers

app.use(express.json());

// 3. Routes

app.use('/api/v1/users', userRouter);

app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl} on this server.`), 404);
});

app.use(globalErrorController);

// Listening on port 3000
module.exports = app;
