const express = require('express');
const streamrequerst = require('../../controllers/stream.controller');
const router = express.Router();
const multer = require('multer');
const { UserAuth, verifyOTP } = require('../../controllers/userauth.controller');
const authorization = require('../../controllers/tokenVerify.controller');


const { CounsellorAuth } = require('../../controllers/Counsellorauth.controller');

router.route('/create/stream').post(UserAuth, streamrequerst.create_stream_request);
router.route('/get/stream').get(CounsellorAuth, streamrequerst.get_stream_details);
router.route('/get/stresscall/details').get(UserAuth, streamrequerst.get_stresscall_details_request);
router.route('/connect/consellor').post(CounsellorAuth, streamrequerst.connect_counsellor_request);
router.route('/counseller/disconnect/consellor').post(CounsellorAuth, streamrequerst.disconnect_counsellor_request);
router.route('/connect/consellor').get(CounsellorAuth, streamrequerst.get_connect_counsellor_request);

router.route('/connected/counseller').get(UserAuth, streamrequerst.get_connected_counseller_request);

router.route('/get/counsellor/streaming/list').get(CounsellorAuth, streamrequerst.get_counsellor_streaming_list);

router.route('/start/cloud').get(UserAuth, streamrequerst.start_cloud_recording);
router.route('/stop/cloud').get(UserAuth, streamrequerst.stop_cloud_recording);
router.route('/stream/end').get(UserAuth, streamrequerst.stream_end);

router.route('/comment').post(CounsellorAuth, streamrequerst.comment_now);
router.route('/previews/comment').get(CounsellorAuth, streamrequerst.get_perviews_comments);
router.route('/comment').get(CounsellorAuth, streamrequerst.get_my_comment);

router.route('/get/my/counsling').get(CounsellorAuth, streamrequerst.get_my_counsling);

router.route('/get/my/comment').get(CounsellorAuth, streamrequerst.get_my_comments);

router.route('/get/my/records').get(UserAuth, streamrequerst.get_my_records);
router.route('/getUserStreamDetails').get(streamrequerst.getUserStreamDetails);



router.route('/counsellor/counseling').get(streamrequerst.get_counsellor_counseling);

router.route('/completed/video/bystream').get(streamrequerst.get_completed_video);



router.route('/inform/neighbour').get(CounsellorAuth, streamrequerst.inform_user_neighbour);

router.route('/inform/immediate').get(CounsellorAuth, streamrequerst.inform_user_immediate);




router.route('/admin/watch').post(authorization, streamrequerst.admin_watch_live);
router.route('/get/livestrea/details').get(authorization, streamrequerst.get_live_stream_details);

router.route('/terminate/stream').get(authorization, streamrequerst.terminate_stream);


module.exports = router;
