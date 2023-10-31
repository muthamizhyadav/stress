const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Counsellor, OTP } = require('../models/userDetails.model');
const { Otp } = require("./otp.service")

const ApiError = require('../utils/ApiError');


const verify_mobile_number = async (req) => {
  const { mobileNumber } = req.body;
  let user = await Counsellor.findOne({ mobileNumber: mobileNumber });

  if (!user) {
    user = await Counsellor.create({
      mobileNumber: mobileNumber,
    })
  }
  await OTP.updateMany({ mobileNumber: mobileNumber }, { $set: { used: true } }, { new: true })
  let otp = await Otp(mobileNumber, user._id);
  return otp;
};


const verify_otp = async (req) => {
  let otpId = req.otp;
  let OTP_Code = req.body.otp;
  let find_otp = await OTP.findById(otpId)
  if (!find_otp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invaid Access');
  }
  if (find_otp.userId != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invaid Access');
  }
  if (find_otp.OTP != OTP_Code) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invaid OTP');
  }
  if (find_otp.expTime < new Date().getTime()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Otp Expired');
  }
  if (find_otp.used) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Used');
  }
  find_otp.used = true;
  find_otp.save();

  let user = await Counsellor.findById(req.userId)
  return user;
}

const get_user_deatils = async (req) => {
  let user = await Counsellor.findById(req.userId)
  return user;
}
module.exports = {  verify_mobile_number, verify_otp, get_user_deatils };
