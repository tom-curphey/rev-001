const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/profile
// @desc Get current users profile
// @access Public
router.get('/', auth, profileController.getProfile);

router.post(
  '/',
  auth,
  [
    check('firstName', 'Your First Name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Your Last Name is required')
      .not()
      .isEmpty(),
    check('position', 'Your Job Position is required')
      .not()
      .isEmpty()
  ],
  profileController.updateProfile
);

// @router POST api/profile/activate
// @desc Activate User & Profile
// @access Public
router.post('/activate', auth, profileController.activateProfile);

// @router POST api/profile/deactivate
// @desc Delete User & Profile
// @access Public
router.post('/deactivate', auth, profileController.deactivateProfile);

module.exports = router;
