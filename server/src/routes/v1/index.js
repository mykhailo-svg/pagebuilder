const express = require('express');

const pageRoute = require('./page.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/page',
    route: pageRoute
  }
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
