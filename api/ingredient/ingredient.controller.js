const Ingredient = require('./ingredient.model');
const User = require('../auth/auth.model');
const Profile = require('../profile/profile.model');
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

  const {
    ingredientID,
    displayName,
    metrics: { cup, whole },
    packetCost,
    packetGrams,
    preferred,
    supplierID
  } = req.body;

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

  console.log('REQ.BODY', req.body);

  const ingredientData = {};
  ingredientData.metrics = {};
  if (ingredientID) ingredientData._id = ingredientID;
  ingredientData.user = req.user.id;
  ingredientData.displayName = displayName;
  ingredientData.urlName = displayName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  if (cup) ingredientData.metrics.cup = cup;
  if (whole) ingredientData.metrics.whole = whole;

  const supplierData = {};
  if (supplierID) supplierData.supplier = supplierID;
  if (preferred) supplierData.preferred = preferred;
  supplierData.packetCost = packetCost;
  supplierData.packetGrams = packetGrams;

  try {
    let ingredient;
    let supplier;
    let profile;
    let iIndex;
    let sIndex;

    // check ingredient ID
    if (!ingredientData._id) {
      // Check if ingredient urlName exits
      ingredient = await Ingredient.find({
        urlName: ingredientData.urlName
      });

      console.log('ingredient', ingredient);

      if (ingredient.length !== 0) {
        // Error - There is already an ingredient by this name
        return res.status(400).json({
          errors: [
            {
              param: 'ingredient',
              msg: 'Ingredient name already exists..'
            }
          ]
        });
      }
      // Add ingredient
      ingredient = new Ingredient(ingredientData);
    } else {
      // Get ingredient by id
      ingredient = await Ingredient.findById(ingredientData._id);
      if (ingredient.length === 0) {
        // Error - There is already an ingredient by this name
        return res.status(400).json({
          errors: [
            {
              param: 'ingredient',
              msg: 'Ingredient could not be saved..'
            }
          ]
        });
      }
    }

    // Get ingredient by id
    supplier = await Supplier.findById(supplierData.supplier);
    if (supplier.length === 0) {
      // Error - There is already an ingredient by this name
      return res.status(400).json({
        errors: [
          {
            param: 'supplier',
            msg: 'Supplier could not be saved..'
          }
        ]
      });
    }

    console.log('supplier---', supplier);

    // Find user profile
    profile = await Profile.findOne({ user: req.user.id });
    if (profile.length === 0) {
      // Error - Couldn't find the profile
      return res.status(400).json({
        errors: [
          {
            param: 'profile',
            msg: 'Ingredient could not be saved..'
          }
        ]
      });
    }

    // Check if ingredient is in user profile
    let profileIngredient = profile.ingredients.filter(
      (pIngredient, i) => {
        // console.log('iIndex', i);
        if (
          pIngredient.ingredient.toString() ===
          ingredient._id.toString()
        ) {
          iIndex = i;
          return ingredient;
        }
      }
    );

    if (profileIngredient.length === 0) {
      // Add ingredient to profile ingredients
      profile.ingredients.push({ ingredient: ingredient._id });
      profileIngredient[0] = profile.ingredients[0];
    }

    // Get index of profile ingredient in array
    profile.ingredients.filter((pIng, pi) => {
      if (pIng.ingredient.toString() === ingredient._id.toString()) {
        iIndex = pi;
        return pIng;
      }
    });

    // Check if supplier ID is in profile ingredient
    let profileIngredientSupplier = profile.ingredients[
      iIndex
    ].suppliers.filter((supplier, s) => {
      if (supplier.supplier.toString() === supplierID.toString()) {
        sIndex = s;
        return supplier;
      }
    });

    if (profileIngredientSupplier.length === 0) {
      // Add supplier to profile ingredient suppliers
      profile.ingredients[iIndex].suppliers.push(supplierData);
      profileIngredientSupplier[0] =
        profile.ingredients[0].suppliers[0];
    } else {
      // Edit profile ingredient supplier

      profile.ingredients[iIndex].suppliers[sIndex] = supplierData;
      profileIngredientSupplier[0] =
        profile.ingredients[0].suppliers[0];
    }

    // Check if supplier ID is in ingredient suppliers list
    const ingredientSupplier = ingredient.suppliers.filter(
      (iSupplier, si) => {
        if (
          iSupplier.supplier.toString() ===
          supplierData.supplier.toString()
        ) {
          sIndex = si;

          return iSupplier;
        }
      }
    );
    if (ingredientSupplier.length === 0) {
      // Add supplier to ingredient suppliers list
      ingredient.suppliers.push(supplierData);
    } else {
      ingredient.suppliers[sIndex] = supplierData;
    }

    // Check if supplier ID is in suppliers list
    const supplierIngredient = supplier.ingredients.filter(
      sIngredient => {
        return (
          sIngredient.ingredient.toString() ===
          ingredient._id.toString()
        );
      }
    );
    if (supplierIngredient.length === 0) {
      // Add supplier to ingredient suppliers list
      supplier.ingredients.push({ ingredient: ingredient._id });
    }

    // Save to database
    await profile.save();
    await supplier.save();
    await ingredient.save();

    return res.status(200).json({ ingredient, supplier });

    // console.log('INGREDIENT', ingredient);
    // console.log('PROFILE', profile);
    // console.log('SUPPLIER', supplier);

    // Return saved
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
