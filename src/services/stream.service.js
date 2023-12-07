const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Stream, Token, Comments } = require('../models/stream.model');
const { Otp } = require("./otp.service")
const AWS = require('aws-sdk');
const ApiError = require('../utils/ApiError');
const Agora = require('agora-access-token');
const appID = 'e1838e4a64e348f8b5ebe8deeff37281';
const appCertificate = 'b0c21c32605f47f8b2228ec8494faa3d';
const { User, Counsellor, } = require("../models/userDetails.model")
const { Timeline, Streamtimeline } = require("../models/timeline.model")

const axios = require('axios');

const create_stream_request = async (req) => {
  let counsellor = await User.findById(req.userId);
  await Stream.updateMany({ userId: req.userId, status: { $ne: "End" } }, { $set: { endTime: new Date().getTime(), LastEnd: new Date(), status: "End" } })
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
    status: "Pending",
    languages: counsellor.languages,
    LastEnd: moment()
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
  let streamss = await Stream.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'stressusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'stressusers',
      },
    },
    { $unwind: "$stressusers" },
    {
      $project: {
        _id: 1,
        actualEndTime: 1,
        endTime: 1,
        startTime: 1,
        usersName: "$stressusers.name",
        languages: "$stressusers.languages",
        lastConnect: 1,
        counseller: 1,
        LastEnd: 1

      }
    }
  ]);
  counsellor.languages.forEach((lan) => {
    if (streamss.length != 0) {
      req.io.emit(lan + "_language", streamss[0]);
    }

  })
  await production_supplier_token_cloudrecording(stream._id);
  return { token, stream };
};

const get_stream_details = async (req) => {
  let streamId = req.query.id;
  const userId = req.userId;
  let stream = await Stream.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  stream = await Stream.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'stressusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'stressusers',
      },
    },
    { $unwind: "$stressusers" },
    {
      $addFields: {
        connected: { $eq: ['$lastConnect', userId] },
      },
    },
    {
      $project: {
        _id: 1,
        actualEndTime: 1,
        endTime: 1,
        startTime: 1,
        usersName: "$stressusers.name",
        languages: "$stressusers.languages",
        lastConnect: 1,
        counseller: 1,
        connected: 1,
        LastEnd: 1

      }
    }
  ]);
  return stream[0];


}



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
      userId: stream.userId,
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
        userId: stream.userId,
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
      cname: token.chennal,
      uid: token.uid.toString(),
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
  if (stream.counseller == 'yes') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Another Counseller Onlive');
  }
  await Streamtimeline.updateMany({ streamId: stream._id, status: "active" }, { $set: { status: "End", End: moment() } }, { new: true });
  const timeline = await Streamtimeline.create({
    streamId: stream._id,
    Start: moment(),
    timeline: req.timeline,
    device: req.deviceInfo,
    userId: stream.userId,
    connectedBy: req.userId,
  });
  const line = await Timeline.findByIdAndUpdate({ _id: req.timeline }, { streamTimeline: timeline._id, watchingStream: stream._id }, { new: true })
  stream.lastConnect = userId;
  stream.counseller = 'yes';
  stream.streamTimeline = timeline._id;
  stream.save();

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

  let streamss = await Stream.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'stressusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'stressusers',
      },
    },
    { $unwind: "$stressusers" },
    {
      $project: {
        _id: 1,
        actualEndTime: 1,
        endTime: 1,
        startTime: 1,
        usersName: "$stressusers.name",
        languages: "$stressusers.languages",
        lastConnect: 1,
        counseller: 1,
        LastEnd: 1

      }
    }
  ]);
  stream.languages.forEach((lan) => {
    req.io.emit(lan + "_language", streamss[0]);
  })


  return { token, stream };
};



const disconnect_counsellor_request = async (req) => {
  console.log("disconnect", 987687667)
  let userId = req.userId;
  let stream = await Stream.findById(req.body.stream);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Fount');
  }
  if (stream.lastConnect != userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your Not Connected');
  }
  stream.lastConnect = null;
  stream.counseller = 'no';
  stream.connected = false;
  stream.LastEnd = new Date().getTime();
  setTimeout(() => {
    stream.languages.forEach((lan) => {
      req.io.emit(lan + "_language", stream);
    })
  }, 400)
  await Streamtimeline.findByIdAndUpdate({ _id: stream.streamTimeline }, { status: "End", End: moment() }, { new: true })
  stream.streamTimeline = null;
  stream.save();
  return stream;
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
        LastEnd: 1

      }
    }
  ])
  return stream[0];
};
const get_connected_counseller_request = async (req) => {
  let stream = await Stream.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Fount');
  }
  let coun = await Counsellor.findById(stream.lastConnect);
  if (coun) {
    return { name: coun.name, languages: coun.languages };
  }
  else {
    return { name: "", languages: [] };
  }


}

const get_connect_counsellor_request = async (req) => {
  let userId = req.userId;
  let stream = await Stream.findById(req.query.id);
  console.log(stream)
  console.log(req.userId)
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Fount');
  }
  if (stream.lastConnect != req.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Eligible');
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
      $lookup: {
        from: 'stressusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'stressusers',
      },
    },
    { $unwind: "$stressusers" },
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
        userName: "$stressusers.name",
        languages: "$stressusers.languages",
        LastEnd: 1

      }
    },
  ])
  return stream[0];
};



const get_counsellor_streaming_list = async (req) => {
  let nowTime = new Date().getTime();
  let userId = req.userId;
  let counsellor = await Counsellor.findById(userId);
  let languages = [];
  if (counsellor) {
    counsellor.languages.forEach((a) => {
      languages.push({ languages: { $in: [a] } })
    })
  }
  let long_match = { $or: languages }
  let stream = await Stream.aggregate([
    { $match: { $and: [long_match, { endTime: { $gte: nowTime } }, { status: { $ne: "End" } }] } },
    {
      $lookup: {
        from: 'stressusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'stressusers',
      },
    },
    { $unwind: "$stressusers" },
    {
      $addFields: {
        connected: { $eq: ['$lastConnect', userId] },
      },
    },
    {
      $lookup: {
        from: 'streamtimelines',
        localField: '_id',
        foreignField: 'streamId',
        as: 'timelines',
      },
    },

    {
      $project: {
        _id: 1,
        actualEndTime: 1,
        endTime: 1,
        startTime: 1,
        usersName: "$stressusers.name",
        languages: "$stressusers.languages",
        lastConnect: 1,
        counseller: 1,
        connected: 1,
        timelines: 1,
        LastEnd: 1
      }
    }
  ]);
  return stream;
};


const start_cloud_recording = async (req) => {
  let id = req.query.id;
  let token = await Token.findOne({ chennal: id, type: 'cloud', recoredStart: { $eq: "acquire" } }).sort({ created: -1 });
  console.log(token, 87768976)
  if (token) {
    let str = await Stream.findById(token.streamId);
    const Authorization = `Basic ${Buffer.from('43a9dd30a7d4445b99ad8b61c32fb35b:bdaaed037ba94837be16c8c93c884ddc').toString(
      'base64'
    )}`;
    let nowDate = moment().format('DDMMYYYY');
    if (token.recoredStart == 'acquire') {
      const resource = token.resourceId;
      const mode = 'mix';
      const start = await axios.post(
        `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
        {
          cname: token.chennal,
          uid: token.uid.toString(),
          clientRequest: {
            token: token.token,
            recordingConfig: {
              maxIdleTime: 15,
              streamTypes: 2,
              channelType: 1,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 1080,
                bitrate: 1000,
                fps: 15,
                mixedVideoLayout: 1,
                backgroundColor: '#FFFFFF',
              },
            },
            recordingFileConfig: {
              avFileType: ['hls', 'mp4'],
            },
            storageConfig: {
              vendor: 1,
              region: 14,
              bucket: 'streamingupload',
              accessKey: 'AKIA3323XNN7Y2RU77UG',
              secretKey: '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',
              fileNamePrefix: [nowDate.toString(), str.store, token.uid.toString()],
            },
          },
        },
        { headers: { Authorization } }
      );
      token.resourceId = start.data.resourceId;
      token.sid = start.data.sid;
      token.recoredStart = 'start';
      token.save();
      setTimeout(async () => {
        await recording_query(token._id);
      }, 3000);
      return start.data;
    }
    else {
      return { message: 'Already Started' };
    }
  }
  else {
    return { message: 'Already Started' };
  }
}


const recording_query = async (id) => {
  const Authorization = `Basic ${Buffer.from('43a9dd30a7d4445b99ad8b61c32fb35b:bdaaed037ba94837be16c8c93c884ddc').toString(
    'base64'
  )}`;
  let temtoken = id;
  let token = await Token.findById(temtoken);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const resource = token.resourceId;
  const sid = token.sid;
  const mode = 'mix';
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  ).then((res) => {
    return res;
  }).catch((err) => {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Query:' + err.message);
  });;
  if (query != null) {
    if (query.data.serverResponse.fileList.length != 0) {
      token.videoLink = query.data.serverResponse.fileList[0].fileName;
      token.videoLink_array = query.data.serverResponse.fileList;
      let m3u8 = query.data.serverResponse.fileList[0].fileName;
      if (m3u8 != null) {
        let mp4 = m3u8.replace('.m3u8', '_0.mp4')
        token.videoLink_mp4 = mp4;
      }
      token.recoredStart = 'query';
      token.save();
    }
  }
  return query.data;
};



const stop_cloud_recording = async (req) => {
  let token = await Token.findOne({ chennal: req.query.id, type: 'cloud', recoredStart: { $eq: "query" } }).sort({ created: -1 });
  if (token) {
    let str = await Stream.findById(token.streamId);
    const Authorization = `Basic ${Buffer.from('43a9dd30a7d4445b99ad8b61c32fb35b:bdaaed037ba94837be16c8c93c884ddc').toString(
      'base64'
    )}`;
    if (token.recoredStart == 'query') {
      const resource = token.resourceId;
      const sid = token.sid;
      const mode = 'mix';

      const stop = await axios.post(
        `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
        {
          cname: token.chennal,
          uid: token.uid.toString(),
          clientRequest: {},
        },
        {
          headers: {
            Authorization,
          },
        }
      ).then((res) => {
        return res;
      }).catch((err) => {

        throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Stop:' + err.message);
      });

      token.recoredStart = 'stop';
      // console.log(stop.data.serverResponse, 987389)
      if (stop.data != null) {
        if (stop.data.serverResponse.fileList.length == 2) {
          token.videoLink = stop.data.serverResponse.fileList[0].fileName;
          token.videoLink_array = stop.data.serverResponse.fileList;
          let m3u8 = stop.data.serverResponse.fileList[0].fileName;
          token.videoLink_mp4 = m3u8;
        }
      }
      token.save();
      return { message: 'Recording Stoped' };
    }
    else {
      return { message: 'Already Stoped' };
    }
  }
  else {
    return { message: 'Clound not Found' };
  }
};

const stream_end = async (req) => {

  let stream = await Stream.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  stream = await Stream.findByIdAndUpdate({ _id: stream._id }, { endTime: new Date().getTime(), status: "End", LastEnd: new Date() }, { new: true });
  req.io.emit(stream._id + "_stream_end", { message: "Stream END" });
  stream.languages.forEach((lan) => {
    req.io.emit(lan + "_language", { streamId: stream._id, status: "End" });
  })

  return stream;

}


const comment_now = async (req) => {

  let userId = req.userId;

  const { streamId, comment, } = req.body;

  let stream = await Stream.findById(streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  let comments = await Comments.findOne({ streamId: streamId, counsellerID: userId });

  if (!comments) {
    comments = await Comments.create({ streamId, comment, userId: stream.userId, counsellerID: userId, Date: moment() });
  }
  else {
    comments.comment = comment;
    comments.save();
  }

  return comments;
}


const get_perviews_comments = async (req) => {

  const page = req.query.page == null || req.query.page == '' || req.query.page == 'null' ? 0 : req.query.page;
  let userId = req.userId;
  let stream = await Stream.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  let comments = await Comments.aggregate([
    { $match: { $and: [{ userId: stream.userId }] } },
    { $sort: { Date: -1 } },
    {
      $lookup: {
        from: 'counsellors',
        localField: 'counsellerID',
        foreignField: '_id',
        as: 'counsellors',
      },
    },
    { $unwind: "$counsellors" },
    {
      $addFields: {
        counsellerName: "$counsellors.name",
        languagesName: "$counsellors.languages",
        this_stream: { $eq: ["$streamId", stream._id] },
        me: { $eq: ["$counsellerID", userId] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let next = await Comments.aggregate([
    { $match: { $and: [{ userId: stream.userId }] } },
    { $sort: { Date: -1 } },
    {
      $lookup: {
        from: 'counsellors',
        localField: 'counsellerID',
        foreignField: '_id',
        as: 'counsellors',
      },
    },
    { $unwind: "$counsellors" },
    {
      $addFields: {
        counsellerName: "$counsellors.name",
        languagesName: "$counsellors.languages",
        this_stream: { $eq: ["$streamId", stream._id] },
        me: { $eq: ["$counsellerID", userId] },
      },
    },
    { $skip: 10 * (page + 1) },
    { $limit: 10 },
  ]);

  return { comments, next: next.length != 0 };
}

const get_my_comment = async (req) => {

  let userId = req.userId;
  let stream = await Stream.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  let comments = await Comments.findOne({ streamId: stream._id, counsellerID: userId });
  return comments;
}


module.exports = {
  create_stream_request,
  get_stream_details,
  get_stresscall_details_requestt,
  get_connected_counseller_request,
  get_counsellor_streaming_list,
  connect_counsellor_request,
  disconnect_counsellor_request,
  get_connect_counsellor_request,
  start_cloud_recording,
  stop_cloud_recording,
  stream_end,
  comment_now,
  get_perviews_comments,
  get_my_comment
};
