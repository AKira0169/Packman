const AppError = require('../Utiles/AppError');

const catchAsync = require('../Utiles/catchAsync');

const Products = require('../models/inventoryModel');

const Order = require('../models/ordersModel');

const factory = require('./handlerFactory');

exports.setProduct = catchAsync(async (req, res, next) => {
  if (!req.body.order) {
    if (req.params.serial) {
      const item = await Products.findOne({ serial: req.params.serial });
      req.body.order = item._id;
      req.body.name = item.name;
      req.body.price = item.price;
      req.body.serial =
        (Math.random() + 1).toString(36).substring(4) + '-Order';
      req.body.createdBy = req.user.name;
      if (req.body.quantity > item.quantity) {
        return next(
          new AppError(
            `Requested quantity more than the available amount only ${item.quantity} Left.`,
            405,
          ),
        );
      }
      item.quantity = item.quantity - req.body.quantity;
      if (item.quantity <= 0) {
        item.status = 'Out of Stock';
        item.quantity = 0;
      }
      await item.save({ validateBeforeSave: false });
    } else {
      const createdOrders = [];

      for (const itemData of req.body.product) {
        const item = await Products.findOne({ serial: itemData.serial });
        req.body.order = item._id;
        req.body.name = item.name;
        req.body.price = item.price;
        req.body.serial =
          (Math.random() + 1).toString(36).substring(4) + '-Order';
        req.body.createdBy = req.user.name;
        req.body.quantity = itemData.quantity;
        req.body.toWhom = itemData.toWhom;
        if (itemData.quantity > item.quantity) {
          return next(
            new AppError(
              `Requested quantity more than the available amount only ${item.quantity} Left.`,
              405,
            ),
          );
        }

        item.quantity = item.quantity - itemData.quantity;
        if (item.quantity <= 0) {
          item.status = 'Out of Stock';
          item.quantity = 0;
        }

        await item.save({ validateBeforeSave: false });

        const order = await Order.create(req.body);
        createdOrders.push(order);
      }
    }
  }
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort({
    createdAt: -1,
  });
  res.status(200).json({
    status: 'success',
    data: orders,
  });
});

exports.cart = catchAsync(async (req, res, next) => {
  res.status(201).json({
    status: 'success',
  });
});

exports.deleteOrder = factory.deleteOne(Order);
