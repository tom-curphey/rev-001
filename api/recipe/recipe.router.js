const express = require('express');
const router = express.Router();
const recipeController = require('./recipe.controller');
const auth = require('../../config/middleware/auth');
const { check } = require('express-validator/check');

// @router GET api/recipe/all
// @desc test route
// @access Private
router.get('/all', auth, recipeController.getRecipes);

// @router GET api/recipe/:recipe_id
// @desc Add or Edit Recipe
// @access Private
router.get('/:recipe_id', auth, recipeController.getRecipeById);

// @router POST api/recipe
// @desc Add or Edit Recipe
// @access Private
router.post(
  '/',
  auth,
  [
    check('displayName', 'Recipe name is required')
      .not()
      .isEmpty()
  ],
  recipeController.addOrEditRecipe
);

module.exports = router;
