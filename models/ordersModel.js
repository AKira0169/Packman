const mongoose = require('mongoose');

const ordersScehma = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Stock',
      required: [true, 'Order must belong to a product!'],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: String,
      required: [true, 'Order must belong to a User'],
    },
    quantity: {
      type: Number,
      required: [true, 'Order must have a quantity'],
    },
    toWhom: {
      type: String,
      required: [true, 'Order must belong to a Buyer'],
    },
    serial: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ordersScehma.pre(/^find/, function (next) {
  this.populate('order');
  next();
});

const Orders = mongoose.model('Orders', ordersScehma);

module.exports = Orders;
