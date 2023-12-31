const Page = require('../models/page.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const createPage = catchAsync(async (req, res) => {
  const options = {
    ...req.body
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
      html: req.body.html,
      shouldPublish: true,
      status: 'notPublished'
    },
    { new: true }
  );
  res.status(httpStatus.OK).send(page);
});

const getPaginatedPages = catchAsync(async (req, res) => {
  const pages = await Page.find({ shop: req.params.shopName });
  res.status(httpStatus.OK).send(pages);
});

module.exports = { createPage, getPageById, updatePage, getPaginatedPages };
