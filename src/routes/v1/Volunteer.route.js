const express = require('express');
const VolundeerController = require('../../controllers/Volunteer.controller');
const router = express.Router();

const { UserAuth, verifyOTP } = require('../../controllers/userauth.controller');

const multer = require('multer');
const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, '');
  },
});
const profile = multer({ storage }).single('profile');
router.route('/create').post(profile, VolundeerController.create_volunteer);
router.route('/getcounsellor').get(VolundeerController.getVolunteers);


router.route('/get/volunteer').get(VolundeerController.get_volunteer);
router.route('/approve').put(VolundeerController.volinteer_approve);
router.route('/reject').put(VolundeerController.volinteer_reject);



module.exports = router;
