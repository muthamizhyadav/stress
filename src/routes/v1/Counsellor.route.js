const express = require('express');
const counsellorcontroller = require('../../controllers/Counsellor.controller');
const router = express.Router();

const { CounsellorAuth, CounsellorOTP } = require("../../controllers/Counsellorauth.controller")

router.route('/verfiy/mobile').post(counsellorcontroller.verify_mobile_number);
router.route('/verfiy/otp').post(CounsellorOTP, counsellorcontroller.verify_otp);
router.route('/resend/otp').post(counsellorcontroller.verify_mobile_number);
router.route('/user/deatils').get(CounsellorAuth, counsellorcontroller.get_user_deatils);


module.exports = router;
