const express = require('express');

const authenController = require('../controllers/authenController');

const orderController = require('../controllers/orderController');

const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.use(authenController.protect);

router.post(
  '/create-new-order/:serial',
  inventoryController.creatingItemAttempts,
  orderController.setProduct,
  orderController.createOrder,
);

router.post(
  '/create-new-order-cart',
  inventoryController.creatingItemAttempts,
  orderController.setProduct,
  orderController.cart,
);

router.get('/', orderController.getAllOrders);
router.delete('/delete-order/:serial', orderController.deleteOrder);

module.exports = router;
