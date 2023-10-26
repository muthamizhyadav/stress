const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    languageKnown: {
      type: Array,
    },
    neighbourContact: {
      type: String,
    },
    favouritePersion: {
      type: String,
    },
    addContact: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);

const counselorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    languageKnown: {
      type: Array,
    },
    neighbourContact: {
      type: String,
    },
    favouritePersion: {
      type: String,
    },
    addContact: {
      type: String,
    },
    universityName: {
      type: String,
    },
    instituteName: {
      type: String,
    },
    idProof: {
      type: String,
    },
    nameOfHospital: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Counsellor = mongoose.model('counsellor', counselorSchema);

const OTPSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userType: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    mobileNumber: {
      type: Number,
    },
    OTP: {
      type: Number,
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model('agentotp', OTPSchema);

module.exports = {
  User,
  Counsellor,
  OTP,
};
