const express = require('express');
const { pageController } = require('../../controllers');

const router = express.Router();

router.route('/').post(pageController.createPage);
router.route('/:pageId').get(pageController.getPageById).put(pageController.updatePage);

module.exports = router;
