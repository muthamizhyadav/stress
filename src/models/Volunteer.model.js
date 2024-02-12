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
    location: {
      type: String,
    },
    Age: {
      type: Number,
    },
    eduction_qualification: {
      type: String,
    },
    Are_you_student: {
      type: String,
    },
    Are_you_Interest: {
      type: String,
    },
    spend_monthly: {
      type: String,
    },
    expectaion_from_us: {
      type: String,
    },
    skils: {
      type: String,
    },
    line: {
      type: String,
    },
    Interest_line: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    name_of_institution: {
      type: String,
    }
  },
  { timestamps: true }
);

const Volunteer = mongoose.model('Volunteer', Volunteerschema);

module.exports = {
  Volunteer,
};
