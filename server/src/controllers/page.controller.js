const Page = require('../models/page.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const createPage = catchAsync(async (req, res) => {
  const options = {
    themeId: req.body.themeId,
    shop: req.body.shop
  };
  const page = await Page.create(options);
  res.status(httpStatus.OK).send(page);
});

const getPageById = catchAsync(async (req, res) => {
  const page = await Page.findById(req.params.pageId);
  res.status(httpStatus.OK).send(page);
});

const updatePage = catchAsync(async (req, res) => {
  if (!req.body.html || !req.body.css) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Set html and css');
  }
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    {
      css: req.body.css,
      html: req.body.html
    },
    { new: true }
  );
  res.status(httpStatus.OK).send(page);
});

module.exports = { createPage, getPageById, updatePage };
