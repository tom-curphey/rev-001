const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const userController = require('./user.controller');
const auth = require('../../config/middleware/auth');

// @router GET api/user
// @desc test route
// @access Public
router.get('/', auth, userController.getUser);

// @router POST api/user
// @desc register user & create profile
// @access Public
router.post(
  '/',
  [
    check('firstName', 'Your First Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
    check(
      'password',
      'Password must be atleast 6 characters long'
    ).isLength({ min: 6 })
  ],
  userController.registerUser
);

// @router POST api/user/login
// @desc Authenticate user and get token
// @access Public
router.post(
  '/login',
  [
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  userController.loginUser
);

module.exports = router;
