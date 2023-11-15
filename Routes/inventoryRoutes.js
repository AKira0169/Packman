const express = require('express');

const authenController = require('../controllers/authenController');

const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.use(authenController.protect);

router.post(
  '/create-new-item',
  inventoryController.creatingItemAttempts,
  inventoryController.createItem,
);

router.get('/', inventoryController.getAllItems);

router.delete('/delete-product/:serial', inventoryController.deleteProduct);

router.patch('/edit-product/:serial', inventoryController.editItem);

module.exports = router;
