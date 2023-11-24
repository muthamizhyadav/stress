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

const connect_counsellor_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.connect_counsellor_request(req);
  res.send(data);
});

const disconnect_counsellor_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.disconnect_counsellor_request(req);
  res.send(data);
});

const get_connect_counsellor_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_connect_counsellor_request(req);
  res.send(data);
});


const get_counsellor_streaming_list = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_counsellor_streaming_list(req);
  res.send(data);
});



const start_cloud_recording = catchAsync(async (req, res) => {
  const data = await streamrequerst.start_cloud_recording(req);
  res.send(data);
});

const stop_cloud_recording = catchAsync(async (req, res) => {
  const data = await streamrequerst.stop_cloud_recording(req);
  res.send(data);
});


const stream_end = catchAsync(async (req, res) => {
  const data = await streamrequerst.stream_end(req);
  res.send(data);
});



module.exports = {
  create_stream_request,
  get_stresscall_details_request,
  get_counsellor_streaming_list,
  connect_counsellor_request,
  disconnect_counsellor_request,
  get_connect_counsellor_request,
  start_cloud_recording,
  stop_cloud_recording,
  stream_end
};
