const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const { v4 } = require('uuid');

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
      type: String,
    },
    email: {
      type: String,
    },
    location: {
      type: String,
    },
    occupation: {
      type: String,
    },
    languageKnown: {
      type: Array,
    },
    neighbourName: {
      type: String,
    },
    neighbourContact: {
      type: String,
    },
    immediateContact: {
      type: String,
    },
    immediateContactRelationship: {
      type: String,
    },
    addContact: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    info_collected: {
      type: Boolean,
      default: false,
    },
    languages: {
      type: Array,
    },
    long: {
      type: Number,
    },
    lat: {
      type: Number,
    },
    gender: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('stressuser', userSchema);

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
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    occupation: {
      type: String,
    },
    languageKnown: {
      type: Array,
    },
    idProof: {
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
    info_collected: {
      type: Boolean,
      default: false,
    },
    professionname: {
      type: String,
    },
    univercityName: {
      type: String,
    },
    professionname: {
      type: String,
    },
    long: {
      type: Number,
    },
    lat: {
      type: Number,
    },
    location: {
      type: String,
    },
    languages: {
      type: Array,
    },
    Id_Proof_Name: {
      type: String,
    },
    Id_Proof_format: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    age: {
      type: Number,
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
    userId: {
      type: String,
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
    expTime: {
      type: Number,
    },
    token: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
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
