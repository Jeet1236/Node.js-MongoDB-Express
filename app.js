/* eslint-disable import/no-dynamic-require */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorController = require('./Controllers/errorController');
const AppError = require('./utils/appError');
const compression = require('compression');

// eslint-disable-next-line import/no-dynamic-require
const userRouter = require(`${__dirname}/routes/userRoutes`);
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const reviewRouter = require(`./routes/reviewRoutes`);
const bookingRouter = require(`${__dirname}/routes/bookingRoutes`);
const viewRouter = require(`./routes/viewRoutes`);

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // or your frontend's origin
    credentials: true, // crucial for cookies to be sent with requests from the frontend
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'), 'views');

// SECURITY
app.use(helmet({ crossOriginEmbedderPolicy: false }));
// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 10,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour',
});
app.use('/api', limiter);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://js.stripe.com/v3/',
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com',
  'ws://127.0.0.1:*/',
  'ws://localhost:*',
  'https://bundle.js:*',
  'ws://127.0.0.1:*/',
  'http://127.0.0.1:*',
  'https://js.stripe.com/v3/',
  'http://localhost:3000/js/bundled.js',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      frameSrc: ['https://js.stripe.com/'],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query attack
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);
// 3. Routes
// Router Handlers

//3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl} on this server.`), 404);
});

app.use(globalErrorController);

// Listening on port 3000
module.exports = app;
