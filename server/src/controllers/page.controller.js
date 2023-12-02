const Page = require('../models/page.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const createPage = catchAsync(async (req, res) => {
  const options = {
    themeId: req.body.themeId,
    shop: req.body.shop,
  };
  const page = await Page.create(options);
  res.status(httpStatus.OK).send(page);
});

module.exports = { createPage };
