const express = require('express');
const userDetailsController = require('../../controllers/userDetails.controller');
const router = express.Router();

router.route('/').post(userDetailsController.createUserDetails);

module.exports = router;
