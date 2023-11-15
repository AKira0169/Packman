const AppError = require('../Utiles/AppError');

const catchAsync = require('../Utiles/catchAsync');

const Products = require('../models/inventoryModel');

const factory = require('./handlerFactory');

const rateLimit = require('express-rate-limit');

exports.creatingItemAttempts = rateLimit({
  max: 1,
  windowMs: 1 * 3000,
  message: 'Please Wait 3 seconds before creating a new product',
});

const stockCheck = async (items) => {
  items.map(async (item) => {
    if (item.quantity <= 0) {
      item.status = 'Out of stock';
      item.quantity = 0;
      await item.save({ validateBeforeSave: false });
    }
  });
};

exports.createItem = catchAsync(async (req, res, next) => {
  req.body.serial = (Math.random() + 1).toString(36).substring(4);
  const item = await Products.create(req.body);
  res.status(201).json({
    status: 'success',
    data: item,
  });
});

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await Products.find();
  stockCheck(items);
  res.status(200).json({
    status: 'success',
    data: items,
  });
});

exports.editItem = catchAsync(async (req, res, next) => {
  req.body.addedAt = Date.now();
  const item = await Products.findOneAndUpdate(
    { serial: req.params.serial },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    item,
  });
});

exports.deleteProduct = factory.deleteOne(Products);
