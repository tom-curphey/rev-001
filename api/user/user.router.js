const express = require('express');
const router = express.Router();

// @router GET api/users
// @desc test route
// @access Public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
