const express = require('express');
const streamrequerst = require('../../controllers/stream.controller');
const router = express.Router();
const multer = require("multer");
const { UserAuth, verifyOTP } = require("../../controllers/userauth.controller")


router.route('/create/stream').post(UserAuth, streamrequerst.create_stream_request);
router.route('/get/stresscall/details').get(UserAuth, streamrequerst.get_stresscall_details_request);



module.exports = router;
