const express = require('express');

const userController = require('../controllers/userController');

const viewController = require('../controllers/viewController');

const authenController = require('../controllers/authenController');

const router = express.Router();

router.get('/login', viewController.loginResirect, viewController.loginview);

router.use(authenController.isLoggedIn);

router.post('/search', authenController.protect, viewController.search);

router.get('/me', authenController.protect, viewController.userView);

router.get(
  '/',
  viewController.home,
  authenController.protect,
  viewController.dashboardView,
);
router.route('/products').get(
  authenController.protect,

  viewController.viewProducts,
);
router.get('/signup', viewController.signUpView);
router.get(
  '/add-item',
  authenController.protect,
  authenController.restrictTo('admin'),
  viewController.additem,
);
router.get('/orders', authenController.protect, viewController.ordersView);
router.get(
  '/make-order/:serial',
  authenController.protect,
  viewController.makeOrderView,
);
router.get(
  '/edit-item/:serial',
  authenController.protect,
  authenController.restrictTo('admin'),
  viewController.editItemView,
);
router.get('/cart', viewController.cartView);

module.exports = router;
