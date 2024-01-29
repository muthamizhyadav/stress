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
const { Timeline, Streamtimeline } = require("../models/timeline.model")

const axios = require('axios');

const auth_details_counsellor = async (socket, auth, next) => {
    const token = auth;
    const connection = socket.handshake.auth.connection;
    try {
        const payload = jwt.verify(token, config.jwt.secret);
        socket.userId = payload.userId;
        socket.name = payload.name;
        socket.mobileNumber = payload.mobileNumber;
        socket.timeline = payload.timeline;
        if (connection == 'stream') {
            if (payload.timeline) {
                let timeline = await Timeline.findById(payload.timeline);
                timeline.socketId = socket.id;
                timeline.save();
            }
            return next();
        }
        else {
            return next();
        }
    } catch {
        return next();
    }

}



const user_disconnect_stream = async (socket, io) => {
    const connection = socket.handshake.auth.connection;
    if (connection == 'stream') {
        let timeline = await Timeline.findById(socket.timeline);

        let stream = await Stream.findById(timeline.watchingStream);
        let streamtimeline = await Streamtimeline.findById(timeline.streamTimeline);
        timeline.watchingStream = null;
        timeline.streamTimeline = null;

        timeline.save();
        if (stream) {
            if (stream.lastConnect == timeline.userId) {
                stream.streamTimeline = null;
                stream.counseller = 'no';
                stream.lastConnect = null;
                stream.LastEnd = new Date();
                streamtimeline.End = moment();
                stream.save();
                let streamss = await Stream.aggregate([
                    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
                    {
                        $lookup: {
                            from: 'stressusers',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'users',
                        },
                    },
                    { $unwind: "$users" },
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
                            usersName: "$users.name",
                            languages: "$users.languages",
                            lastConnect: 1,
                            counseller: "no",
                            LastEnd: 1,
                            timelines: 1
                        }
                    }
                ]);
                // console.log(streamss,8768768,stream)
                stream.languages.forEach(async (lan) => {
                    console.log(lan + "_language")
                    io.emit(lan + "_language", streamss[0]);
                })
            }
        }
        if (streamtimeline) {
            streamtimeline.status = "End";
            streamtimeline.End = moment();
            streamtimeline.save();
        }
    }
    console.log('User disconnected', socket.name, socket.mobileNumber, socket.id, socket.timeline, connection);


}


module.exports = {
    auth_details_counsellor,
    user_disconnect_stream
}