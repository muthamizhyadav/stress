const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Stream, Token } = require('../models/stream.model');
const AWS = require('aws-sdk');
const ApiError = require('../utils/ApiError');
const Agora = require('agora-access-token');
const appID = 'e1838e4a64e348f8b5ebe8deeff37281';
const appCertificate = 'b0c21c32605f47f8b2228ec8494faa3d';
const { User, Counsellor } = require("../models/userDetails.model")

const axios = require('axios');

const auth_details_counsellor = async (socket, auth, next) => {

    const token = auth;

    try {
        const payload = jwt.verify(token, config.jwt.secret);
        socket.userId = payload.userId;
        socket.name = payload.name;
        socket.mobileNumber = payload.mobileNumber;
        return next();
    } catch {
        return next();
    }
}


module.exports = {
    auth_details_counsellor
}