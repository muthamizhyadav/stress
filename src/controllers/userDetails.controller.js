const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const UserDetailsService = require('../services/userDetails.service');

const { generateAuthTokens } = require("../services/token.service")
const { createTimeline } = require("../services/timeline.service")

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
  const timeline = await createTimeline(data, 'clint', req.deviceInfo);
  const token = await generateAuthTokens(data, timeline);
  res.send(token);
});


const verify_otp_get = catchAsync(async (req, res) => {
  const data = await UserDetailsService.verify_otp_get(req);
  res.send(data);
});

const get_user_deatils = catchAsync(async (req, res) => {
  const data = await UserDetailsService.get_user_deatils(req);
  res.send(data);
});

const update_user_deatils = catchAsync(async (req, res) => {
  const data = await UserDetailsService.update_user_deatils(req);
  res.send(data);
});

const upload_image_profile = catchAsync(async (req, res) => {
  const data = await UserDetailsService.upload_image_profile(req);
  res.send(data);
});


module.exports = {
  createUserDetails,
  verify_mobile_number,
  verify_otp,
  verify_otp_get,
  get_user_deatils,
  update_user_deatils,
  upload_image_profile
};
