const express = require('express');
// eslint-disable-next-line import/extensions
const authController = require('./../Controllers/authController');

const Router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../Controllers/userController');

Router.post('/signup', authController.signup);

Router.route('/').get(getAllUsers).post(createUser);

Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = Router;
