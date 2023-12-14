const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Counsellor, OTP } = require('../models/userDetails.model');
const { Otp } = require("./otp.service")
const createUserDetails = async (body) => {
  let val = await User.create(body);
  return val;
};
const ApiError = require('../utils/ApiError');
const AWS = require('aws-sdk');

const verify_mobile_number = async (req) => {
  const { mobileNumber } = req.body;
  let user = await User.findOne({ mobileNumber: mobileNumber });
  console.log(user, mobileNumber)
  if (!user) {
    user = await User.create({
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
  console.log(otpId, 9879)
  let find_otp = await OTP.findById(otpId)
  console.log(find_otp, 879)
  if (!find_otp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  if (find_otp.userId != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  if (find_otp.OTP != OTP_Code) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  if (find_otp.expTime < new Date().getTime()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Otp Expired');
  }
  if (find_otp.used) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Used');
  }

  find_otp.used = true;
  find_otp.save();

  let user = await User.findById(req.userId)
  console.log(user)

  return user;
}
const verify_otp_get = async (req) => {
  let otpId = req.otp;
  let find_otp = await OTP.findById(otpId).select({
    OTP: 0,
    token: 0,
    used: 0,
    userId: 0,
    active: 0,
    userType: 0,
    _id: 0,
  });
  return find_otp;
}

const get_user_deatils = async (req) => {
  let user = await User.findById(req.userId)
  return user;
}

const update_user_deatils = async (req) => {
  let user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  user = await User.findByIdAndUpdate({ _id: user._id }, { ...req.body, ...{ info_collected: true } }, { new: true });
  return user;
}

const upload_image_profile = async (req) => {
  if (req.file != null) {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIA3323XNN7Y2RU77UG',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });
    let params = {
      Bucket: 'anti-stress',
      Key: req.file.originalname,
      Body: req.file.buffer,
    };
    let counsellor;
    return new Promise((resolve) => {
      s3.upload(params, async (err, data) => {
        if (err) {
        }
        counsellor = await User.findByIdAndUpdate({ _id: req.userId }, { profileImage: data.Location }, { new: true });
        resolve({ teaser: 'success', counsellor });
      });
    });
  } else {
    return { message: 'Invalid' };
  }
}
module.exports = {
  createUserDetails,
  verify_mobile_number,
  verify_otp,
  get_user_deatils,
  verify_otp_get,
  update_user_deatils,
  upload_image_profile
};
