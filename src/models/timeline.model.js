const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const { v4 } = require('uuid')

const timelineSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    type: {
      type: String
    },
    socketId: {
      type: String,
    },
    loginToken: {
      type: String,
    },
    Start: {
      type: Number,
    },
    End: {
      type: Number,
    },
    device: {
      type: Object,
    },
    status: {
      type: String,
      default: "active",
    }
  },
  { timestamps: true }
);

const Timeline = mongoose.model('timeline', timelineSchema);

module.exports = {
  Timeline,
};
