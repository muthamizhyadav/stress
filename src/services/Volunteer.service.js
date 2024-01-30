const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Volunteer } = require('../models/Volunteer.model');
const { Counsellor } = require('../models/userDetails.model');
const { Otp } = require('./otp.service');
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
};

// Manage Volunteers

const getVolunteers = async (req) => {
  let { page, status, name_mobile } = req.query;
  page = parseInt(page);
  let statusMatch = { info_collected: true }
  let nameMatch = { info_collected: true  }

  if (status != '' && status != 'null' && status != null && status) {
    if (status == 'Active') {
      statusMatch = { active: true }
    } else {
      statusMatch = { active: false }
    }
  }

  if (name_mobile && name_mobile != '' && name_mobile != null && name_mobile != 'null') {
    console.log(parseInt(name_mobile))
    nameMatch = { $or: [{ name: { $regex: name_mobile, $options: "i" } },{ mobileNumber: {$regex:name_mobile,$options:"i"}}] }
  }


  let values = await Counsellor.aggregate([
    {
      $match: {
        $and: [statusMatch, nameMatch]
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);
  let next = await Counsellor.aggregate([
    {
      $match: {
        $and: [statusMatch, nameMatch]
      },
    },
    {
      $limit: 10,
    },
    {
      $skip: page + 1 + page * 10,
    },
  ]);
  console.log(next);
  return { values, next: next.length == 0 ? false : true };
};

module.exports = {
  create_volunteer,
  getVolunteers,
};
