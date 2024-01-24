const express = require('express');
const counsellorcontroller = require('../../controllers/Counsellor.controller');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, '');
  },
});
const upload = multer({ storage }).single('ID_proof');
const profile = multer({ storage }).single('profile');

const { CounsellorAuth, CounsellorOTP, verifyOTP } = require('../../controllers/Counsellorauth.controller');

router.route('/verfiy/mobile').post(counsellorcontroller.verify_mobile_number);
router.route('/verfiy/otp').post(CounsellorOTP, counsellorcontroller.verify_otp);
router.route('/verfiy/otp').get(verifyOTP, counsellorcontroller.verify_otp_get);
router.route('/resend/otp').post(counsellorcontroller.verify_mobile_number);
router.route('/user/deatils').get(CounsellorAuth, counsellorcontroller.get_user_deatils);
router.route('/user/deatils/idproof').put(CounsellorAuth, upload, counsellorcontroller.upload_image_idproof);
router.route('/user/deatils/profile').put(CounsellorAuth, profile, counsellorcontroller.upload_image_profile);
router.route('/user/deatils').post(CounsellorAuth, counsellorcontroller.update_user_deatils);
router.route('/enable/disable').put(counsellorcontroller.enable_Disable);

module.exports = router;
