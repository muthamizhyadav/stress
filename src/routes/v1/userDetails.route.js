const express = require('express');
const userDetailsController = require('../../controllers/userDetails.controller');
const router = express.Router();

const { UserAuth, verifyOTP } = require("../../controllers/userauth.controller")

const multer = require("multer");
const storage = multer.memoryStorage({
    destination: function (req, res, callback) {
        callback(null, '');
    },
});
const profile = multer({ storage }).single('profile');

router.route('/').post(userDetailsController.createUserDetails);
router.route('/verfiy/mobile').post(userDetailsController.verify_mobile_number);
router.route('/verfiy/otp').post(verifyOTP, userDetailsController.verify_otp);
router.route('/verfiy/otp').get(verifyOTP, userDetailsController.verify_otp_get);
router.route('/resend/otp').post(userDetailsController.verify_mobile_number);


router.route('/user/deatils').get(UserAuth, userDetailsController.get_user_deatils);
router.route('/user/deatils').post(UserAuth, userDetailsController.update_user_deatils);


router.route('/user/profile/upload').put(UserAuth, profile, userDetailsController.upload_image_profile);



module.exports = router;
