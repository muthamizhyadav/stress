const express = require('express');
const streamrequerst = require('../../controllers/stream.controller');
const router = express.Router();
const multer = require("multer");
const { UserAuth, verifyOTP } = require("../../controllers/userauth.controller")

const { CounsellorAuth } = require("../../controllers/Counsellorauth.controller")

router.route('/create/stream').post(UserAuth, streamrequerst.create_stream_request);
router.route('/get/stresscall/details').get(UserAuth, streamrequerst.get_stresscall_details_request);
router.route('/connect/consellor').post(CounsellorAuth, streamrequerst.connect_counsellor_request);
router.route('/counseller/disconnect/consellor').post(CounsellorAuth, streamrequerst.disconnect_counsellor_request);
router.route('/connect/consellor').get(CounsellorAuth, streamrequerst.get_connect_counsellor_request);
router.route('/get/counsellor/streaming/list').get(CounsellorAuth, streamrequerst.get_counsellor_streaming_list);

router.route('/start/cloud').get(UserAuth, streamrequerst.start_cloud_recording);
router.route('/stop/cloud').get(UserAuth, streamrequerst.stop_cloud_recording);
router.route('/stream/end').get(UserAuth, streamrequerst.stream_end);




router.route('/comment').post(CounsellorAuth, streamrequerst.comment_now);
router.route('/previews/comment').get(CounsellorAuth, streamrequerst.get_perviews_comments);
router.route('/comment').get(CounsellorAuth, streamrequerst.get_my_comment);



module.exports = router;
