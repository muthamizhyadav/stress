const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Counsellor } = require('../models/userDetails.model');
const ApiError = require('../utils/ApiError');


const CounsellorAuth = async (req, res, next) => {
  const token = req.headers.auth;
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access set');
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload)
    const userss = await Counsellor.findById(payload['userId']);
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Found');
    }
    if (!userss.active) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Disabled');
    }
    req.userId = payload['userId'];
    req.timeline = payload.timeline;
    return next();
  } catch {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access val');
  }
};
const CounsellorOTP = async (req, res, next) => {
  const token = req.headers['otptoken'];
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access set');
  }
  try {
    console.log(token, 2342)
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload, 2342)
    const userss = await Counsellor.findById(payload['userId']);
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Found');
    }

    req.userId = payload['userId'];
    req.otp = payload['id'];
    return next();
  } catch {
    throw new ApiError(httpStatus.NOT_FOUND, 'Otp Expired');
  }
};

const verifyOTP = async (req, res, next) => {
  const token = req.headers['otptoken'];
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access set');
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload, 2342)
    const userss = await Counsellor.findById(payload['userId']);
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Found');
    }

    req.userId = payload['userId'];
    req.otp = payload['id'];
    return next();
  } catch {
    return res.send(httpStatus.BAD_GATEWAY, 'Otp Expired');
  }
};


module.exports = { CounsellorAuth, CounsellorOTP, verifyOTP };
