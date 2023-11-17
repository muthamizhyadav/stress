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
  await Stream.updateMany({ userId: req.userId, status: { $ne: "End" } }, { $set: { endTime: new Date().getTime(), status: "End" } })
  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(60, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  const uid = await generateUid();
  let stream = await Stream.create({
    chennal: req.userId,
    userId: req.userId,
    actualEndTime: currentTimestamp,
    startTime: moment(),
    endTime: currentTimestamp,
    status: "Pending"
  });
  let tokens = await geenerate_rtc_token(stream._id, uid, 1, expirationTimestamp);
  stream.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
  stream.save();
  let token = await Token.create({
    type: "host",
    token: tokens,
    uid: uid,
    streamId: stream._id,
    chennal: stream._id,
    userId: req.userId
  });
  return { token, stream };
  await production_supplier_token_cloudrecording(stream._id);
};



const production_supplier_token_cloudrecording = async (id) => {
  let streamId = id;
  // let agoraToken = await AgoraAppId.findById(agroaID)
  let stream = await Stream.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  // console.log(stream);
  value = await Token.findOne({ chennal: streamId, type: 'cloud', recoredStart: { $in: ["query", 'start',] } });
  if (!value) {
    const uid = await generateUid();
    const role = Agora.RtcRole.SUBSCRIBER;
    const expirationTimestamp = stream.endTime / 1000;
    value = await Token.create({
      uid: uid,
      streamId: stream._id,
      chennal: stream._id,
      userId: req.userId,
      type: 'cloud',
    });
    const token = await geenerate_rtc_token(stream._id, uid, 1, expirationTimestamp);
    value.token = token;
    value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
    value.save();
    if (value.videoLink == '' || value.videoLink == null) {
      await agora_acquire(value._id, stream);
    }
  } else {
    let token = value;
    const resource = token.resourceId;
    const sid = token.sid;
    const mode = 'mix';
    const Authorization = `Basic ${Buffer.from('43a9dd30a7d4445b99ad8b61c32fb35b:bdaaed037ba94837be16c8c93c884ddc').toString(
      'base64'
    )}`;
    await axios.get(
      `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
      { headers: { Authorization } }
    ).then((res) => {

    }).catch(async (error) => {
      await Token.findByIdAndUpdate({ _id: value._id }, { recoredStart: "stop" }, { new: true });
      const uid = await generateUid();
      const role = Agora.RtcRole.SUBSCRIBER;
      const expirationTimestamp = stream.endTime / 1000;
      value = await Token.create({
        uid: uid,
        streamId: stream._id,
        chennal: stream._id,
        userId: req.userId,
        type: 'cloud',

      });
      const token = await geenerate_rtc_token(stream._id, uid, 1, expirationTimestamp);
      value.token = token;
      value.store = stream._id.replace(/[^a-zA-Z0-9]/g, '');
      value.save();
      await agora_acquire(value._id, stream);
    });
  }
  return value;
};


const agora_acquire = async (id, stream) => {
  let temtoken = id;
  let token = await Token.findById(temtoken);
  const Authorization = `Basic ${Buffer.from('43a9dd30a7d4445b99ad8b61c32fb35b:bdaaed037ba94837be16c8c93c884ddc').toString(
    'base64'
  )}`;
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID.replace(/\s/g, '')}/cloud_recording/acquire`,
    {
      cname: token.chennel,
      uid: token.Uid.toString(),
      clientRequest: {
        resourceExpiredHour: 24,
        scene: 0,
      },
    },
    { headers: { Authorization } }
  );
  token.resourceId = acquire.data.resourceId;
  token.recoredStart = 'acquire';
  token.save();
};


const connect_counsellor_request = async (req) => {
  let userId = req.userId;
  let stream = await Stream.findById(req.body.stream);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Fount');
  }
  let token = await Token.find({ streamId: stream._id, userId: userId }).count();
  if (token == 0) {
    const expirationTimestamp = stream.actualEndTime / 1000
    const uid = await generateUid();
    let tokens = await geenerate_rtc_token(stream._id, uid, 1, expirationTimestamp);
    token = await Token.create({
      type: "counsellor",
      token: tokens,
      uid: uid,
      streamId: stream._id,
      chennal: stream._id,
      userId: userId
    });
  }
  else {
    token = await Token.find({ streamId: stream._id, userId: userId });
    token = await Token.findById(token[0]._id);
  }
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
        store: 1,
      }
    }
  ])
  return stream[0];
};

const get_connect_counsellor_request = async (req) => {
  let userId = req.userId;
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
              userId: { $eq: userId }
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
        store: 1,
      }
    }
  ])
  return stream[0];
};



const get_counsellor_streaming_list = async (req) => {
  let nowTime = new Date().getTime();
  let stream = await Stream.aggregate([
    { $match: { $and: [{ endTime: { $gte: nowTime } }, { status: { $ne: "End" } }] } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    { $unwind: "$users" },
    {
      $project: {
        _id: 1,
        actualEndTime: 1,
        endTime: 1,
        startTime: 1,
        usersName: "$users.name",
        languages: "$users.languages",
      }
    }
  ]);
  return stream;
};


module.exports = {
  create_stream_request,
  get_stresscall_details_requestt,
  get_counsellor_streaming_list,
  connect_counsellor_request,
  get_connect_counsellor_request
};
