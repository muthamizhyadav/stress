const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const agoraRoute = require('./AgoraAppId.route');
const userDetails = require('./userDetails.route');
const Counsellor = require('./Counsellor.route');
const b2buser = require('./B2Busers.route');
const menu = require('./menue.route');
const role = require('./role.route');
const stream = require('./stream.route');
const Volunteer = require('./Volunteer.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/volunteer',
    route: Volunteer,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/agora',
    route: agoraRoute,
  },
  {
    path: '/userDetails',
    route: userDetails,
  },
  {
    path: '/counsellor',
    route: Counsellor,
  },
  {
    path: '/b2bUsers',
    route: b2buser,
  },
  {
    path: '/role',
    route: role,
  },
  {
    path: '/stream',
    route: stream,
  },
  {
    path: '/menu',
    route: menu,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
