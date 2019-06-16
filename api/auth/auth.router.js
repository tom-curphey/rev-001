const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const authController = require('./auth.controller');
const auth = require('../../config/middleware/auth');

// @router GET api/auth
// @desc test route
// @access Public
router.get('/', auth, authController.getUser);

// @router POST api/auth
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
  authController.registerUser
);

// @router POST api/auth/signin
// @desc Authenticate user and get token
// @access Public
router.post(
  '/signin',
  [
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  authController.signinUser
);

// @router POST api/auth/update
// @desc update user
// @access Private
router.post(
  '/update',
  auth,
  [
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not valid').isEmail()
  ],
  authController.updateUser
);

module.exports = router;
