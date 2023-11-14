const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const streamrequerst = require('../services/stream.service');


const create_stream_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.create_stream_request(req);
  res.send(data);
});

const get_stresscall_details_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_stresscall_details_requestt(req);
  res.send(data);
});



module.exports = {
  create_stream_request,
  get_stresscall_details_request
};
