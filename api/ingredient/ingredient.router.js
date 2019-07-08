const express = require('express');
const router = express.Router();
const ingredientController = require('./ingredient.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/ingredient
// @desc get ingredients
// @access Private
router.get('/all', auth, ingredientController.getIngredients);

// @router POST api/ingredient
// @desc Add or Edit Ingredient
// @access Private
router.post(
  '/',
  auth,
  [
    check('displayName', 'Ingredient name is required')
      .not()
      .isEmpty()
  ],
  ingredientController.addOrEditIngredientAndSupplier
);

module.exports = router;
