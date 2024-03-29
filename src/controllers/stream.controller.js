const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const streamrequerst = require('../services/stream.service');

const create_stream_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.create_stream_request(req);
  res.send(data);
});

const get_stream_details = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_stream_details(req);
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

const get_connected_counseller_request = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_connected_counseller_request(req);
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

const comment_now = catchAsync(async (req, res) => {
  const data = await streamrequerst.comment_now(req);
  res.send(data);
});

const get_perviews_comments = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_perviews_comments(req);
  res.send(data);
});

const get_my_comment = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_my_comment(req);
  res.send(data);
});

const get_my_counsling = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_my_counsling(req);
  res.send(data);
});

const get_my_comments = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_my_comments(req);
  res.send(data);
});

const get_my_records = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_my_records(req);
  res.send(data);
});

const getUserStreamDetails = catchAsync(async (req, res) => {
  const data = await streamrequerst.getUserStreamDetails(req);
  res.send(data);
});

const get_counsellor_counseling = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_counsellor_counseling(req);
  res.send(data);
});

const get_completed_video = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_completed_video(req);
  res.send(data);
});


const inform_user_neighbour = catchAsync(async (req, res) => {
  const data = await streamrequerst.inform_user_immediate(req);
  res.send(data);
});

const inform_user_immediate = catchAsync(async (req, res) => {
  const data = await streamrequerst.inform_user_neighbour(req);
  res.send(data);
});


const admin_watch_live = catchAsync(async (req, res) => {
  const data = await streamrequerst.admin_watch_live(req);
  res.send(data);
});

const get_live_stream_details = catchAsync(async (req, res) => {
  const data = await streamrequerst.get_live_stream_details(req);
  res.send(data);
});

const terminate_stream = catchAsync(async (req, res) => {
  const data = await streamrequerst.terminate_stream(req);
  res.send(data);
});


module.exports = {
  create_stream_request,
  get_stream_details,
  get_stresscall_details_request,
  get_counsellor_streaming_list,
  connect_counsellor_request,
  disconnect_counsellor_request,
  get_connect_counsellor_request,
  get_connected_counseller_request,
  start_cloud_recording,
  stop_cloud_recording,
  stream_end,
  comment_now,
  get_perviews_comments,
  get_my_comment,
  get_connected_counseller_request,
  get_my_counsling,
  get_my_comments,
  get_my_records,
  getUserStreamDetails,
  get_completed_video,
  get_counsellor_counseling,
  inform_user_neighbour,
  inform_user_immediate,
  admin_watch_live,
  get_live_stream_details,
  terminate_stream
};
