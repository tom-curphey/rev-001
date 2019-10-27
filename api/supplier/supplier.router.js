const express = require('express');
const router = express.Router();
const supplierController = require('./supplier.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/supplier
// @desc get suppliers
// @access Private
router.get('/all', auth, supplierController.getSuppliers);

// @router POST api/supplier
// @desc Add or Edit supplier
// @access Private
router.post(
  '/',
  auth,
  [
    check('displayName', 'Supplier name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('email', 'Supplier email is required')
      .not()
      .isEmpty()
  ],
  supplierController.addOrEditSupplier
);

module.exports = router;
