const express = require('express');

const userController = require('../controllers/userController');

const authenController = require('../controllers/authenController');

const router = express.Router();

router.post('/changePassword', authenController.changePassword);

router.post(
  '/login',
  authenController.passwordAttempts,
  authenController.login,
);

router.post('/signup', authenController.signUp);

router.get('/logout', authenController.logout);

router
  .route('/')
  .get(
    authenController.protect,
    authenController.restrictTo('admin'),
    userController.getAllUsers,
  );

router.patch(
  '/update-info',
  authenController.protect,
  userController.updateInfo,
);
module.exports = router;
