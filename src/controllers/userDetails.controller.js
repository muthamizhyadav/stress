const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const UserDetailsService = require('../services/userDetails.service');

const createUserDetails = catchAsync(async (req, res) => {
  const data = await UserDetailsService.createUserDetails(req.body);
  res.send(data);
});

module.exports = {
  createUserDetails,
};
