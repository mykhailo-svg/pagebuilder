const express = require('express');
const { pageController } = require('../../controllers');

const router = express.Router();

router.route('/').post(pageController.createPage);

module.exports = router;
