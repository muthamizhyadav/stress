const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const VolundeerService = require('../services/Volunteer.service');

const { generateAuthTokens } = require("../services/token.service")
const { createTimeline } = require("../services/timeline.service")

const create_volunteer = catchAsync(async (req, res) => {
  const data = await VolundeerService.create_volunteer(req);
  res.send(data);
});


module.exports = {
  create_volunteer
};
