const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const VolundeerService = require('../services/Volunteer.service');

const { generateAuthTokens } = require('../services/token.service');
const { createTimeline } = require('../services/timeline.service');

const create_volunteer = catchAsync(async (req, res) => {
  const data = await VolundeerService.create_volunteer(req);
  res.send(data);
});

const getVolunteers = catchAsync(async (req, res) => {
  const data = await VolundeerService.getVolunteers(req);
  res.send(data);
});


const get_volunteer = catchAsync(async (req, res) => {
  const data = await VolundeerService.get_volunteer(req);
  res.send(data);
});

const volinteer_approve = catchAsync(async (req, res) => {
  const data = await VolundeerService.volinteer_approve(req);
  res.send(data);
});

const volinteer_reject = catchAsync(async (req, res) => {
  const data = await VolundeerService.volinteer_reject(req);
  res.send(data);
});


module.exports = {
  create_volunteer,
  getVolunteers,
  get_volunteer,
  volinteer_approve,
  volinteer_reject
};
