const express = require('express');
const router = express.Router();
const ingredientController = require('./ingredient.controller');

// @router GET api/ingredient
// @desc test route
// @access Public
router.get('/', ingredientController.getIngredient);

module.exports = router;
