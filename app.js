const path = require('path');

const pug = require('pug');

const express = require('express');

const rateLimit = require('express-rate-limit');

const hpp = require('hpp');

const helmet = require('helmet');

const bodyParser = require('body-parser');

const userRoutes = require('./Routes/userRoutes');

const inventoryRoutes = require('./Routes/inventoryRoutes');

const orderRoutes = require('./Routes/orderRoutes');

const viewRoutes = require('./Routes/viewRoutes');

const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./Utiles/AppError');

const cookieParser = require('cookie-parser');

const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');

// Start express app

const app = express();

app.use(cookieParser());

console.log(process.env.NODE_ENV);

app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);

// express.static
// app.set('view engine', 'jade');

app.use(
  hpp({
    whitelist: ['price'],
  }),
);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

app.use(mongoSanitize());

app.use(xss());

app.use('/', viewRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/inventory', inventoryRoutes);

app.use('/api/v1/orders', orderRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
