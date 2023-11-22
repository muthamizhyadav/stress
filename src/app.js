const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const initSocketService = require('./socket.io/socket.service');
const logger = require('./config/logger');



const app = express();


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);


const socketIO = require('socket.io');
let http = require('http');
let server = http.Server(app);
const io = socketIO(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});


// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
const deviceDetais = async (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const deviceInfo = parseUserAgent(userAgent);
  // //console.log(deviceInfo)
  req.deviceInfo = deviceInfo;
  return next();
};



// v1 api routes
app.use('/v1', deviceDetais, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


server.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});



initSocketService(server, io);


module.exports = app;
