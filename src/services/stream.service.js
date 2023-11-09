const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Stream, Token } = require('../models/stream.model');
const { Otp } = require("./otp.service")
const AWS = require('aws-sdk');
const ApiError = require('../utils/ApiError');

const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');



const create_stream_request = async (req) => {
  let moment_curr=moment();
  const currentTimestamp = moment_curr.add(15, 'minutes');
  const expirationTimestamp = currentTimestamp / 1000;
  const role = Agora.RtcRole.PUBLISHER;
  const uid = await generateUid();
  let stream = await Stream.create({
    chennal: req.userId,
    userId: req.userId,
    actualEndTime: currentTimestamp,
    startTime: moment(),
    endTime: currentTimestamp,
  });
  let tokens = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp);

  let token = await Token.create({
    type: "host",
    token: tokens,
    uid: uid,
    streamId: stream._id,
    chennal: stream._id,
  });
  return { token, stream };
};

const generateUid = async (req) => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};


const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp) => {
  // let agoraToken = await AgoraAppId.findById(agoraID)
  return Agora.RtcTokenBuilder.buildTokenWithUid("84d6325953e84954b34ec3c8dfd05b47", "cfae9d54b3e84d85b13b8ec6d67ed200", chennel, uid, role, expirationTimestamp);
};

module.exports = { create_stream_request };
