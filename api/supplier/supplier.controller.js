const Supplier = require('./supplier.model');
const Profile = require('../profile/profile.model');
const Ingredient = require('../ingredient/ingredient.model');
const User = require('../auth/auth.model');
const { validationResult } = require('express-validator/check');

module.exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ urlName: 1 });

    // console.log('SUPPLIERS', suppliers);

    if (suppliers.length === 0) {
      return res.status(400).json({
        errors: [
          {
            param: 'supplier',
            msg: 'You have no suppliers'
          }
        ]
      });
    }
    res.status(200).json(suppliers);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditSupplier = async (req, res) => {
  console.log('req.body supplier ####>', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    _id,
    displayName,
    email,
    phone,
    address,
    website,
    ingredients,
    confirmedDetails
  } = req.body;

  const supplierData = {};

  if (_id) supplierData._id = _id;
  supplierData.user = req.user.id;
  supplierData.displayName = displayName;
  supplierData.urlName = displayName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  supplierData.email = email;
  supplierData.phone = phone;
  supplierData.address = address;
  supplierData.website = website;
  supplierData.confirmedDetails = confirmedDetails;
  supplierData.ingredients = ingredients;
  if (req.body.ingredient) {
    supplierData.metrics = {};
  }
  const ingredientData = {
    ingredient: req.body.ingredient,
    packetCost: req.body.packetCost,
    packetGrams: req.body.packetGrams
  };

  console.log('supplier DATA +++ ', supplierData);

  try {
    let supplier;
    if (_id) {
      supplier = await Supplier.findById(supplierData._id);
      if (supplier.length === 0) {
        // Error - There is already an supplier by this name
        return res.status(400).json({
          errors: [
            {
              param: 'supplier',
              msg: 'Supplier could not be saved..'
            }
          ]
        });
      }

      if (supplier.displayName !== supplierData.displayName) {
        let supplierNameCheck = await Supplier.find({
          urlName: supplierData.urlName
        });

        // console.log('supplier', supplier);

        if (supplierNameCheck.length !== 0) {
          // Error - There is already an supplier by this name
          return res.status(400).json({
            errors: [
              {
                param: 'supplier',
                msg: 'Supplier name already exists..'
              }
            ]
          });
        }
      }

      console.log('supplier', supplier);

      supplier.displayName = supplierData.displayName;
      supplier.urlName = supplierData.urlName;
      supplier.email = supplierData.email;
      supplier.phone = supplierData.phone;
      supplier.address = supplierData.address;
      supplier.website = supplierData.website;

      console.log('up supplier', supplier);

      await supplier.save();
      console.log('updated supplier  +++ ', supplier);
      return res.status(200).json(supplier);
    } else {
      supplier = await Supplier.findOne({
        $or: [
          { urlName: supplierData.urlName },
          { email: supplierData.email }
        ]
      });
      if (supplier) {
        return res.status(400).json({
          errors: [
            {
              param: 'displayName',
              msg: 'There is already an supplier by this name..'
            }
          ]
        });
      }

      supplier = new Supplier(supplierData);

      // Check if ingredient is not null to save supplier to ingredient
      if (ingredientData.ingredient !== null) {
        ingredient = await Ingredient.findById(
          ingredientData.ingredient
        );

        if (ingredient.length === 0) {
          return res.status(400).json({
            errors: [
              {
                param: 'ingredient',
                msg: 'Supplier could not be saved to ingredient'
              }
            ]
          });
        }

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

        // Ingredient was found
        let ingredientSupplierData = {
          packetCost: ingredientData.packetCost,
          packetGrams: ingredientData.packetCost,
          profileSaveCount: 1,
          supplier: supplier._id
        };

        await ingredient.suppliers.push(ingredientSupplierData);
        // await console.log('ingredient___>', ingredient);

        //  Profile was found
        let newProfileIngredientSupplierData = {
          preferred: true,
          supplier: supplier._id,
          packetCost: ingredientData.packetCost,
          packetGrams: ingredientData.packetCost
        };

        let piIndex = null;

        // Find ingredient in profile ingredients
        let pIngredient = profile.ingredients.filter((ing, index) => {
          if (
            ing.ingredient.toString() ===
            ingredientData.ingredient.toString()
          ) {
            piIndex = index;
            return ing;
          }
        });

        // console.log('pIngredient XXXX', pIngredient[0]);
        let upIngredientSuppliers = [];
        // add ingredient to profile if pIngredient was not found
        if (pIngredient.length !== 0) {
          console.log('PROFILE INGREDIENT WAS FOUND');
          upIngredientSuppliers = pIngredient[0].suppliers.map(
            piSupplier => {
              let uSupplier = {
                ...piSupplier,
                preferred: false
              };
              return uSupplier;
            }
          );
        } else {
          console.log('ADD PROFILE INGREDIENT WITH SUPPLIER');
          let newProfileIngredient = {
            ingredient: ingredientData.ingredient,
            suppliers: {
              ...upIngredientSuppliers
            }
          };
          profile.ingredients.push(newProfileIngredient);
        }
        upIngredientSuppliers.push(newProfileIngredientSupplierData);

        profile.ingredients[
          piIndex
        ].suppliers = upIngredientSuppliers;

        await console.log('profile___>', profile);

        await profile.save();
        await ingredient.save();
      }

      await supplier.save();
      return res.status(200).json(supplier);
      // return res.status(500).send('Sever Error');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
