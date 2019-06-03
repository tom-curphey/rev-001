const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const auth = require('../../config/middleware/auth');

// @router GET api/profile
// @desc Get current users profile
// @access Public
router.get('/', auth, profileController.getProfile);

module.exports = router;
