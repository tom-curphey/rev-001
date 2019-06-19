const express = require('express');
const router = express.Router();
const venueController = require('./venue.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/venue/all
// @desc Get current users venues
// @access Public
router.get('/all', auth, venueController.getVenues);

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

// @router POST api/venue/activate
// @desc Activate venue
// @access Public
router.post('/activate', auth, venueController.activateVenue);

// @router POST api/venue/deactivate
// @desc Deactivate venue
// @access Public
router.post('/deactivate', auth, venueController.deactivateVenue);

module.exports = router;
