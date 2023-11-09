const express = require('express');
const streamrequerst = require('../../controllers/stream.controller');
const router = express.Router();
const multer = require("multer");
const { UserAuth, verifyOTP } = require("../../controllers/userauth.controller")


router.route('/create/stream').post(UserAuth, streamrequerst.create_stream_request);



module.exports = router;
