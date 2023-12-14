const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const counsellorcontroller = require('../services/Counsellor.service');
const { createTimeline } = require("../services/timeline.service")

const { generateAuthTokens } = require("../services/token.service")


const verify_mobile_number = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.verify_mobile_number(req);
  res.send(data);
});


const verify_otp = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.verify_otp(req);
  const timeline = await createTimeline(data, 'counsellor', req.deviceInfo);
  const token = await generateAuthTokens(data, timeline);
  res.send(token);
});

const verify_otp_get = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.verify_otp_get(req);
  res.send(data);
});
const get_user_deatils = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.get_user_deatils(req);
  res.send(data);
});

const update_user_deatils = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.update_user_deatils(req);
  res.send(data);
});
const upload_image_idproof = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.upload_image_idproof(req);
  res.send(data);
});

const upload_image_profile = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.upload_image_profile(req);
  res.send(data);
});

module.exports = {
  verify_mobile_number,
  verify_otp,
  get_user_deatils,
  verify_otp_get,
  upload_image_idproof,
  update_user_deatils,
  upload_image_profile
};
