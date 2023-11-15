const AppError = require('../Utiles/AppError');

const Products = require('../models/inventoryModel');

const Orders = require('../models/ordersModel');

const catchAsync = require('../Utiles/catchAsync');

const APIFeatures = require('../Utiles/apiFeatures');

const stockCheck = async (items) => {
  items.map(async (item) => {
    if (item.quantity <= 0) {
      item.status = 'Out of stock';
      item.quantity = 0;
      await item.save({ validateBeforeSave: false });
    }
    if (item.status === 'Out of stock') {
      if (item.quantity > 0) {
        item.status = 'In Stock';
        await item.save({ validateBeforeSave: false });
      }
    }
  });
};

const DateConvertor = (date) => {
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

exports.loginResirect = async (req, res, next) => {
  if (req.cookies.jwt) {
    return next(
      new AppError(
        'You are already logged in Please log out to switch account.',
        404,
      ),
    );
  }
  next();
};

exports.loginview = catchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Login' });
});
exports.signUpView = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', { title: 'Sign Up' });
});

exports.search = catchAsync(async (req, res, next) => {
  const products = await Products.find({
    name: { $regex: new RegExp('^' + req.body.input + '.*', 'i') },
  }).lean();
  const orders = await Orders.find({
    name: {
      $regex: new RegExp('^' + req.body.input + '.*', 'i'),
    },
  }).lean();
  // Create a new property for the formatted date
  products.forEach((element) => {
    element.addedAt = DateConvertor(element.addedAt);
  });
  orders.forEach((element) => {
    element.createdAt = DateConvertor(element.createdAt);
  });
  res.status(200).json({
    status: 'success',
    products,
    orders,
    user: res.locals.user,
  });
});

exports.viewProducts = catchAsync(async (req, res, next) => {
  const products = await Products.find();
  const page = req.query.page || 1;
  stockCheck(products);
  const sortedProducts = APIFeatures.sortProducts(products);
  const paginatedProducts = APIFeatures.paginate(
    sortedProducts,
    parseInt(page),
  );
  res.locals.currentPage = parseInt(page) || 1;
  res.status(200).render('products', {
    title: 'Products',
    products: paginatedProducts,
    totalProducts: products,
  });
});

exports.userView = catchAsync(async (req, res, next) => {
  res.status(200).render('userMang', { title: 'Me' });
});

exports.makeOrderView = catchAsync(async (req, res, next) => {
  const item = await Products.findOne({ serial: req.params.serial });
  res.status(200).render('makeorder', {
    title: 'Make Order',
    item,
  });
});
exports.additem = catchAsync(async (req, res, next) => {
  res.status(200).render('additem', { title: 'Add Product' });
});

exports.ordersView = catchAsync(async (req, res, next) => {
  const orders = await Orders.find().sort({
    createdAt: -1,
  });
  const page = req.query.page || 1;
  const paginatedOrders = APIFeatures.paginate(orders, parseInt(page));
  res.locals.currentPage = parseInt(page) || 1;
  res.status(200).render('order', {
    title: 'Orders',
    orders: paginatedOrders,
    totalOrders: orders,
  });
});

exports.home = catchAsync(async (req, res, next) => {
  if (!req.user) {
    res.status(200).render('login', { title: 'Login' });
  }
  next();
});

exports.editItemView = catchAsync(async (req, res, next) => {
  const item = await Products.findOne({ serial: req.params.serial });

  res.status(200).render('edit-item', { title: 'Edit Product', item });
});

exports.dashboardView = catchAsync(async (req, res, next) => {
  const Totalproducts = await Products.find();
  const Totalorders = await Orders.find();
  const totalProfit = await Orders.aggregate([
    {
      $project: {
        totalProfit: { $multiply: ['$price', '$quantity'] },
      },
    },
    {
      $group: {
        _id: null,
        totalProfit: {
          $sum: '$totalProfit',
        },
      },
    },
  ]);

  if (totalProfit.length < 1) {
    totalProfit.push({ totalProfit: 0 });
  }

  res.status(200).render('dashboard', {
    title: 'Dashboard',
    Totalproducts,
    Totalorders,
    totalProfit,
  });
});
