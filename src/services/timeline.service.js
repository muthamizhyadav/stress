const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Timeline } = require('../models/timeline.model');
const ApiError = require('../utils/ApiError');


const createTimeline = async (user, role, deviceInfo) => {
  let data = { userId: user._id, type: role, device: deviceInfo }
  let val = await Timeline.create(data);
  return val;
};



module.exports = { createTimeline };
