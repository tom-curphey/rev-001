const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');

// @router GET api/profile
// @desc test route
// @access Public
router.get('/', profileController.getProfile);

module.exports = router;
