const Recipe = require('./recipe.model');
const User = require('../auth/auth.model');
const { validationResult } = require('express-validator/check');

module.exports.getRecipes = async (req, res) => {
  console.log('Recipe Controller');
  try {
    const recipes = await Recipe.find({ user: req.user.id });
    if (!recipes) {
      return res.status(400).json({
        errors: [
          {
            param: 'recipe',
            msg: 'You have no recipes'
          }
        ]
      });
    }
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditRecipe = async (req, res) => {
  console.log('RECIPE REQ', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    _id,
    displayName,
    serves,
    salePricePerServe,
    expectedSales,
    processTime
  } = req.body;

  const recipeData = {};
  if (_id) recipeData._id = _id;
  recipeData.user = req.user.id;
  recipeData.displayName = displayName;
  recipeData.urlName = displayName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  if (serves) recipeData.serves = serves;
  if (salePricePerServe)
    recipeData.salePricePerServe = salePricePerServe;
  if (expectedSales) recipeData.expectedSales = expectedSales;
  if (processTime) {
    const updatedProcessTime = processTime.map(item => {
      if (item._id === '__isNew__') {
        const newItem = {
          description: item.description,
          order: item.order,
          quantity: item.quantity,
          total: item.total,
          unit: item.unit
        };
        item = newItem;
      }
      return item;
    });
    recipeData.processTime = updatedProcessTime;
  }

  try {
    if (_id) {
      const recipe = await Recipe.findByIdAndUpdate(
        recipeData._id,
        { $set: recipeData },
        { new: true }
      );

      // recipe.save();
      return res.status(200).json(recipe);
    } else {
      console.log('Create new recipe');

      let recipe = await Recipe.findOne({
        displayName: displayName
      });
      if (recipe) {
        return res.status(400).json({
          errors: [
            {
              param: 'recipe',
              msg: 'You already have a recipe by this name..'
            }
          ]
        });
      }

      recipe = new Recipe(recipeData);

      await recipe.save();
      return res.status(200).json(recipe);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
