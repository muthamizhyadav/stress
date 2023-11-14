const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Stream, Token } = require('../models/stream.model');
const { Otp } = require("./otp.service")
const AWS = require('aws-sdk');
const ApiError = require('../utils/ApiError');
const Agora = require('agora-access-token');
const appID = 'e1838e4a64e348f8b5ebe8deeff37281';
const appCertificate = 'b0c21c32605f47f8b2228ec8494faa3d';

const create_stream_request = async (req) => {
  // let moment_curr = moment();
  // const currentTimestamp = moment_curr.add(1000, 'minutes');
  // const expirationTimestamp = currentTimestamp / 1000;
  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(600, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  console.log(expirationTimestamp, 9878979)
  const role = Agora.RtcRole.SUBSCRIBER;
  const uid = await generateUid();
  let stream = await Stream.create({
    chennal: req.userId,
    userId: req.userId,
    actualEndTime: currentTimestamp,
    startTime: moment(),
    endTime: currentTimestamp,
  });
  console.log(stream, 78676832)
  console.log(stream._id, uid, role, expirationTimestamp)
  let tokens = await geenerate_rtc_token(stream._id, uid, 1, expirationTimestamp);

  let token = await Token.create({
    type: "host",
    token: tokens,
    uid: uid,
    streamId: stream._id,
    chennal: stream._id,
    store: stream._id.replace(/[^a-zA-Z0-9]/g, '')
  });
  return { token, stream };
};

const generateUid = async (req) => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};


const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp) => {
  return Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, chennel, uid, role, expirationTimestamp);
  // return Agora.RtcTokenBuilder.buildTokenWithUid("3a9e3f2cf6e44c9bb48dcc932a59d5d8", "3004174acdfb44fd81372f86b711eca0", chennel, uid, role, expirationTimestamp);
};

const get_stresscall_details_requestt = async (req) => {
  console.log(req.query.id, 8789)
  let stream = await Stream.findById(req.query.id)
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Fount');
  }
  stream = await Stream.aggregate([
    {
      $match: {
        $and: [
          { _id: { $eq: req.query.id } }
        ]
      }
    },
    {
      $lookup: {
        from: 'streamtokens',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          {
            $match: {
              type: { $eq: "host" }
            }
          },
        ],
        as: 'streamtokens',
      },
    },
    { $unwind: "$streamtokens" },
    {
      $project: {
        _id: 1,
        userId: 1,
        actualEndTime: 1,
        startTime: 1,
        endTime: 1,
        token: "$streamtokens.token",
        uid: "$streamtokens.uid",
        chennal: "$streamtokens.chennal",
        store: "$streamtokens.store",
      }
    }
  ])
  return stream[0];
};


module.exports = { create_stream_request, get_stresscall_details_requestt };
