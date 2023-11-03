const express = require('express');
const userDetailsController = require('../../controllers/userDetails.controller');
const router = express.Router();

const { UserAuth, verifyOTP } = require("../../controllers/userauth.controller")

router.route('/').post(userDetailsController.createUserDetails);
router.route('/verfiy/mobile').post(userDetailsController.verify_mobile_number);
router.route('/verfiy/otp').post(verifyOTP, userDetailsController.verify_otp);
router.route('/verfiy/otp').get(verifyOTP, userDetailsController.verify_otp_get);
router.route('/resend/otp').post(userDetailsController.verify_mobile_number);


router.route('/user/deatils').get(UserAuth, userDetailsController.get_user_deatils);
router.route('/user/deatils').post(UserAuth, userDetailsController.update_user_deatils);


module.exports = router;
