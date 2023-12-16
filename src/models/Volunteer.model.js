const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const { v4 } = require('uuid')


const Volunteerschema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model('Volunteer', Volunteerschema);

module.exports = {
  Volunteer,
};
