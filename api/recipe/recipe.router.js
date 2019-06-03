const express = require('express');
const router = express.Router();
const recipeController = require('./recipe.controller');

// @router GET api/recipe/all
// @desc test route
// @access Public
router.get('/', recipeController.getRecipes);
// router.route('/').get(recipeController.getRecipes);

module.exports = router;
