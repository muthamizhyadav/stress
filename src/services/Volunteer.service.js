const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Volunteer } = require('../models/Volunteer.model');
const { Otp } = require("./otp.service")
const createUserDetails = async (body) => {
  let val = await User.create(body);
  return val;
};
const ApiError = require('../utils/ApiError');
const AWS = require('aws-sdk');


const create_volunteer = async (req) => {

  let phone = await Volunteer.findOne({ phoneNumber: req.body.phoneNumber });

  if (phone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Already Exists');
  }
  email = await Volunteer.findOne({ email: req.body.email });
  if (email) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Exists');
  }
  let value = await Volunteer.create(req.body);

  return value;
}
module.exports = {
  create_volunteer
};
