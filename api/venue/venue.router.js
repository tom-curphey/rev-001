const express = require('express');
const router = express.Router();
const venueController = require('./venue.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/venue
// @desc Get current users venue
// @access Public
router.get('/', auth, venueController.getVenue);

router.post(
  '/',
  auth,
  [
    check('displayName', 'Venue Name is required')
      .not()
      .isEmpty(),
    check('email', 'Venue email is required')
      .not()
      .isEmpty(),
    check('email', 'Venue email is not valid').isEmail(),
    check('type', 'Venue Type is required')
      .not()
      .isEmpty()
  ],
  venueController.addOrEditVenue
);

module.exports = router;
