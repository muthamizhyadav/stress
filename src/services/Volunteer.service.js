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
  let nameMatch = { info_collected: true }

  if (status && status != '' && status != 'null' && status != null) {
    if (status == 'Active') {
      statusMatch = { active: true }
    } else {
      statusMatch = { active: false }
    }
  }

  if (name_mobile && name_mobile != '' && name_mobile != null && name_mobile != 'null') {
    console.log(parseInt(name_mobile))
    nameMatch = { $or: [{ name: { $regex: name_mobile, $options: "i" } }, { mobileNumber: { $regex: name_mobile, $options: "i" } }] }
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
    { $skip: 10 * (page + 1) },
  ]);
  return { values, next: next.length == 0 ? false : true };
};


const get_volunteer = async (req) => {
  const page = req.query.page == null || req.query.page == '' || req.query.page == 'null' ? 0 : parseInt(req.query.page);

  console.log(page)

  let value = await Volunteer.aggregate([
    { $match: { $and: [{ active: true }] } },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);

  let next = await Volunteer.aggregate([
    { $match: { $and: [{ active: true }] } },
    { $skip: 10 * (page + 1) },
    { $limit: 10 },
  ])

  return { value, next: next.length != 0 };
}

const volinteer_approve = async (req) => {

  let value = await Volunteer.findById(req.body.id);

  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Volunteer Not Found');
  }

  value.status = 'Approved';
  value.save();
  return value;
}


const volinteer_reject = async (req) => {
  let value = await Volunteer.findById(req.body.id);

  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Volunteer Not Found');
  }

  value.status = 'Rejected';
  value.save();
  return value;
}
module.exports = {
  create_volunteer,
  getVolunteers,
  get_volunteer,
  volinteer_approve,
  volinteer_reject
};
