const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Counsellor, OTP } = require('../models/userDetails.model');

const createUserDetails = async (body) => {
  let val = await User.create(body);
  return val;
};

module.exports = { createUserDetails };
