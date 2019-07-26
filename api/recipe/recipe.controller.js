const Recipe = require('./recipe.model');
const User = require('../auth/auth.model');
const { validationResult } = require('express-validator/check');

module.exports.getRecipes = async (req, res) => {
  console.log('Recipe Controller');
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({
      urlName: 1
    });
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
  console.log('RECIPE REQ', req.user.id);

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
    processTime,
    ingredients,
    totalGrams,
    totalTime,
    confirmed
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
          staffTime: item.staffTime,
          quantity: item.quantity,
          total: item.total,
          unit: item.unit
        };
        item = newItem;
      }
      // item.quantity = item.quantity !== '' ? item.quantity : 0;
      return item;
    });
    recipeData.processTime = updatedProcessTime;
  }
  // if (processTime) recipeData.processTime = processTime;
  if (ingredients) {
    const filteredIngredients = ingredients.filter(ing => {
      return ing.ingredient !== '__isNew__';
    });

    recipeData.ingredients = filteredIngredients;
  }
  recipeData.totalGrams = totalGrams ? totalGrams : 0;
  recipeData.totalTime = totalTime ? totalTime : 0;
  if (confirmed) recipeData.confirmed = confirmed;

  try {
    if (_id && _id !== '__isNew__') {
      console.log('Edit Recipe', recipeData);
      const recipe = await Recipe.findByIdAndUpdate(
        recipeData._id,
        { $set: recipeData },
        { new: true }
      );

      // recipe.save();
      return res.status(200).json(recipe);
    } else {
      console.log('Create new recipe', recipeData);

      let recipe = await Recipe.findOne({
        urlName: recipeData.urlName,
        user: req.user.id
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

      // Remove __isNew__ from recipeData
      delete recipeData._id;
      console.log('Updated new recipe', recipeData);

      recipe = new Recipe(recipeData);

      await recipe.save();
      return res.status(200).json(recipe);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
