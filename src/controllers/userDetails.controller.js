const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const UserDetailsService = require('../services/userDetails.service');

const { generateAuthTokens } = require("../services/token.service")

const createUserDetails = catchAsync(async (req, res) => {
  const data = await UserDetailsService.createUserDetails(req.body);
  res.send(data);
});

const verify_mobile_number = catchAsync(async (req, res) => {
  const data = await UserDetailsService.verify_mobile_number(req);
  res.send(data);
});


const verify_otp = catchAsync(async (req, res) => {
  const data = await UserDetailsService.verify_otp(req);
  const token = await generateAuthTokens(data)
  res.send(token);
});


const get_user_deatils = catchAsync(async (req, res) => {
  const data = await UserDetailsService.get_user_deatils(req);
  res.send(data);
});

module.exports = {
  createUserDetails,
  verify_mobile_number,
  verify_otp,
  get_user_deatils
};
