const express = require('express');
// eslint-disable-next-line import/extensions
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const Router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../Controllers/userController');

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);

Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);
// Protect all these routes after this line
Router.use(authController.protect);

Router.get('/me', userController.getMe, userController.getUser);

Router.patch('/updatePasswords', authController.updatePassword);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);

Router.route('/').get(getAllUsers).post(createUser);

Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = Router;
