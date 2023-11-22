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
      type: Number
    },
    socketId: {
      type: String,
    },
    loginToken: {
      type: String,
    },
    Start: {
      type: String,
    },
    End: {
      type: String,
    },
    device: {
      type: Object,
    }
  },
  { timestamps: true }
);

const Timeline = mongoose.model('timeline', timelineSchema);




module.exports = {
  Timeline,
};
