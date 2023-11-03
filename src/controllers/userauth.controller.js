const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models/userDetails.model');
const ApiError = require('../utils/ApiError');


const UserAuth = async (req, res, next) => {
  const token = req.headers.auth;

  console.log(token)
  // console.log(token)
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access set');
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload)
    const userss = await User.findById(payload['userId']);
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Found');
    }
    if (!userss.active) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Disabled');
    }
    req.userId = payload['userId'];
    req.timeline = payload.timeline;
    // if (userss.mainSeller == 'admin') {
    //   req.accessBy = userss._id;
    // } else {
    //   req.accessBy = userss.mainSeller;
    // }
    return next();
  } catch {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access val');
  }
};
const verifyOTP = async (req, res, next) => {
  const token = req.headers['otptoken'];
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access set');
  }
  try {
    console.log(token, 2342)
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload, 2342)
    const userss = await User.findById(payload['userId']);
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


module.exports = { UserAuth, verifyOTP };
