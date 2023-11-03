const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const counsellorcontroller = require('../services/Counsellor.service');

const { generateAuthTokens } = require("../services/token.service")


const verify_mobile_number = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.verify_mobile_number(req);
  res.send(data);
});


const verify_otp = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.verify_otp(req);
  const token = await generateAuthTokens(data)
  res.send(token);
});


const get_user_deatils = catchAsync(async (req, res) => {
  const data = await counsellorcontroller.get_user_deatils(req);
  res.send(data);
});

module.exports = {
  verify_mobile_number,
  verify_otp,
  get_user_deatils
};
