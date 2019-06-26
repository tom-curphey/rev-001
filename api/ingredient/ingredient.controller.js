const Ingredient = require('./ingredient.model');
const User = require('../auth/auth.model');
const { validationResult } = require('express-validator/check');

module.exports.getIngredients = async (req, res) => {
  console.log('Ingredient Controller');
  try {
    const ingredients = await Ingredient.find({ user: req.user.id });
    if (ingredients.length === 0) {
      return res.status(400).json({
        errors: [
          {
            param: 'ingredient',
            msg: 'You have no ingredients'
          }
        ]
      });
    }
    res.status(200).json(ingredients);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditIngredient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { _id, displayName, cup, whole } = req.body;

  if (cup) {
    console.log('CUP', cup);
  }

  if (!cup && !whole) {
    return res.status(400).json({
      errors: [
        {
          param: 'ingredient',
          msg:
            'New Ingredients required to atleast have 1 unit metric provided'
        }
      ]
    });
  }

  const ingredientData = {};
  ingredientData.metrics = {};
  if (_id) ingredientData._id = _id;
  ingredientData.user = req.user.id;
  ingredientData.displayName = displayName;
  ingredientData.urlName = displayName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  if (cup) ingredientData.metrics.cup = cup;
  if (whole) ingredientData.metrics.whole = whole;

  try {
    if (_id) {
      const ingredient = await Ingredient.findById(_id);
    } else {
      let ingredient = await Ingredient.findOne({
        urlName: ingredientData.urlName
      });
      if (ingredient) {
        return res.status(400).json({
          errors: [
            {
              param: 'ingredient',
              msg: 'There is already an ingredient by this name..'
            }
          ]
        });
      }

      ingredient = new Ingredient(ingredientData);

      await ingredient.save();
      return res.status(200).json(ingredient);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
