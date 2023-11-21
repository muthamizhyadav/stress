const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const { v4 } = require('uuid')

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
      type: Number
    },
    endTime: {
      type: Number
    },
    actualEndTime: {
      type: Number
    },
    agoraID: {
      type: String,
    },
    store: {
      type: String,
    },
    status: {
      type: String,
      default: "Online"
    },
    languages: {
      type: Array
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
      type: String
    },
    uid: {
      type: Number
    },
    streamId: {
      type: String
    },
    type: {
      type: String
    },
    cloudrecordURL: {
      type: String
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


module.exports = {
  Stream,
  Token
};
