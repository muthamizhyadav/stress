const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const { v4 } = require('uuid');

const StreamSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    actualEndTime: {
      type: Number,
    },
    agoraID: {
      type: String,
    },
    store: {
      type: String,
    },
    status: {
      type: String,
      default: 'Online',
    },
    languages: {
      type: Array,
    },
    lastConnect: {
      type: String,
    },
    counseller: {
      type: String,
      default: 'no',
    },
    streamTimeline: {
      type: String,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    LastEnd: {
      type: Number,
    },
    counlingCount: {
      type: Number,
    },
    adminStatus: {
      type: String,
      default: 'Waiting',
    },
    terminate_user: {
      type: String,
    }
  },
  { timestamps: true }
);

const Stream = mongoose.model('stream', StreamSchema);

const tokenSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    uid: {
      type: Number,
    },
    streamId: {
      type: String,
    },
    type: {
      type: String,
    },
    cloudrecordURL: {
      type: String,
    },
    resourceId: {
      type: String,
    },
    sid: {
      type: String,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    videoLink: {
      type: String,
    },
    videoLink_array: {
      type: Array,
    },
    videoLink_mp4: {
      type: String,
    },
    recoredStart: {
      type: String,
      default: 'Pending',
    },
    chennal: {
      type: String,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model('streamtoken', tokenSchema);

const commentsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    counsellerID: {
      type: String,
    },
    userId: {
      type: String,
    },
    comment: {
      type: String,
    },
    Date: {
      type: Number,
    },
    streamId: {
      type: String,
    },
    streamTimeline: {
      type: String,
    }
  },
  { timestamps: true }
);

const Comments = mongoose.model('comment', commentsSchema);




const informSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    counsellerID: {
      type: String,
    },
    userId: {
      type: String,
    },
    streamId: {
      type: String,
    },
    type: {
      type: String,
    },
    neighbour: {
      type: Boolean,
      default: false
    },
    immediate: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "Counsellor Informed"
    },
    streamTimeLine: {
      type: String,
    }

  },
  { timestamps: true }
);

const Informadmin = mongoose.model('informadmin', informSchema);



module.exports = {
  Stream,
  Token,
  Comments,
  Informadmin
};
