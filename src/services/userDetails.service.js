const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Counsellor, OTP } = require('../models/userDetails.model');
const { Otp } = require('./otp.service');
const createUserDetails = async (body) => {
  let val = await User.create(body);
  return val;
};
const ApiError = require('../utils/ApiError');
const AWS = require('aws-sdk');
const { Stream } = require('winston/lib/winston/transports');

const verify_mobile_number = async (req) => {
  const { mobileNumber } = req.body;
  let user = await User.findOne({ mobileNumber: mobileNumber });
  //console.log(user, mobileNumber);
  if (!user) {
    user = await User.create({
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
  //console.log(otpId, 9879);
  let find_otp = await OTP.findById(otpId);
  //console.log(find_otp, 879);
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

  let user = await User.findById(req.userId);
  //console.log(user);

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

const get_user_deatils = async (req) => {
  let user = await User.findById(req.userId);
  return user;
};

const update_user_deatils = async (req) => {
  let user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  user = await User.findByIdAndUpdate({ _id: user._id }, { ...req.body, ...{ info_collected: true } }, { new: true });
  return user;
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
        counsellor = await User.findByIdAndUpdate({ _id: req.userId }, { profileImage: data.Location }, { new: true });
        resolve({ teaser: 'success', counsellor });
      });
    });
  } else {
    return { message: 'Invalid' };
  }
};

const  manage_Clients = async (req) => {
  let { page, status, name_mobile } = req.query;
  let statusMatch = { _id: { $ne: null } }
  let nameMatch = { _id: { $ne: null } }

  if (status && status != '' && status != null) {
    if (status == 'Active') {
      statusMatch = { active: true }
    } else {
      statusMatch = { active: false }
    }
  }

  if (name_mobile && name_mobile != null && name_mobile != 'null' && name_mobile != '') {
    nameMatch = { $or: [{ name: { $regex: name_mobile, $options: "i" } }, { mobileNumber: { $regex: name_mobile, $options: "i" } }] }
  }
  page = parseInt(page);
  let user = await User.aggregate([
    {
      $match: {
        $and: [statusMatch, nameMatch, { info_collected: { $eq: true } }]
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);
  let next = await User.aggregate([
    {
      $match: {
        $and: [statusMatch, nameMatch, { info_collected: { $eq: true } }]
      },
    },
    { $skip: 10 * (page + 1) },
    {
      $limit: 10,
    },
  ]);
  return { user, next: next.length == 0 ? false : true };
};

const enable_Disable = async (req) => {
  const { id } = req.body;
  let values = await User.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
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
  createUserDetails,
  verify_mobile_number,
  verify_otp,
  get_user_deatils,
  verify_otp_get,
  update_user_deatils,
  upload_image_profile,
  manage_Clients,
  enable_Disable,
  Otp
};
