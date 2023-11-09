const express = require('express');
const b2bUsersController = require('../../controllers/B2BUser.Controller');
const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');

router.post('/login', b2bUsersController.B2bUsersLogin);

module.exports = router;
