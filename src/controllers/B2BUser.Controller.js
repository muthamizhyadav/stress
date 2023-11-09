const catchAsync = require('../utils/catchAsync');
const b2bUsersService = require('../services/B2BUsers.service');
const tokenService = require('../services/token.service');

const B2bUsersLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.UsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  res.send({ users, tokens });
});


module.exports = {

  B2bUsersLogin,

};
