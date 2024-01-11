const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Counsellor, OTP } = require('../models/userDetails.model');
const { Otp } = require('./otp.service');
const AWS = require('aws-sdk');
const ApiError = require('../utils/ApiError');

const verify_mobile_number = async (req) => {
  const { mobileNumber } = req.body;
  let user = await Counsellor.findOne({ mobileNumber: mobileNumber });

  if (!user) {
    user = await Counsellor.create({
      mobileNumber: mobileNumber,
    });
  }
  await OTP.updateMany({ mobileNumber: mobileNumber }, { $set: { used: true } }, { new: true });
  let otp = await Otp(mobileNumber, user._id);
  return otp;
};

const verify_otp = async (req) => {
  let otpId = req.otp;
  let OTP_Code = req.body.otp;
  let find_otp = await OTP.findById(otpId);
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

  let user = await Counsellor.findById(req.userId);
  return user;
};

const get_user_deatils = async (req) => {
  let user = await Counsellor.findById(req.userId);
  return user;
};

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
};

const upload_image_idproof = async (req) => {
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
        counsellor = await Counsellor.findByIdAndUpdate({ _id: req.userId }, { idProof: data.Location }, { new: true });
        resolve({ teaser: 'success', counsellor });
      });
    });
  } else {
    return { message: 'Invalid' };
  }
};

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
        counsellor = await Counsellor.findByIdAndUpdate({ _id: req.userId }, { profileImage: data.Location }, { new: true });
        resolve({ teaser: 'success', counsellor });
      });
    });
  } else {
    return { message: 'Invalid' };
  }
};

const update_user_deatils = async (req) => {
  let user = await Counsellor.findById(req.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  user = await Counsellor.findByIdAndUpdate({ _id: user._id }, { ...req.body, ...{ info_collected: true } }, { new: true });
  return user;
};

const enable_Disable = async (req) => {
  const { id } = req.body;
  let values = await Counsellor.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Counseller not found');
  }
  if (values.active == true) {
    values.active = false;
  } else {
    values.active = true;
  }
  values.save();
  return values;
};

module.exports = {
  verify_mobile_number,
  verify_otp,
  get_user_deatils,
  verify_otp_get,
  upload_image_idproof,
  update_user_deatils,
  upload_image_profile,
  enable_Disable,
};
