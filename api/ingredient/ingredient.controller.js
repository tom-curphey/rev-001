const Ingredient = require('./ingredient.model');
const User = require('../auth/auth.model');
const Profile = require('../profile/profile.model');
const { validationResult } = require('express-validator/check');

module.exports.getIngredients = async (req, res) => {
  console.log('Ingredient Controller');
  try {
    const ingredients = await Ingredient.find()
      .sort({ urlName: 1 })
      .populate('suppliers.supplier', ['displayName']);
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

    // console.log(ingredients[0].suppliers);

    res.status(200).json(ingredients);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditIngredientAndSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    ingredientID,
    suppliers,
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

  // console.log('REQ.BODY', req.body);

  const ingredientData = {};
  ingredientData.metrics = {};
  if (ingredientID) ingredientData._id = ingredientID;
  ingredientData.Profile = req.user.id;
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

      // console.log('ingredient', ingredient);

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

    // console.log('supplier---', supplier);

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

    // Set profile ingredient supplier to null so we can check it later
    let profileIngredientSupplier = null;
    // We use a for loop to edit all suppliers so when the preferred status changes all suppliers can be edited
    for (
      let pisi = 0;
      pisi < profile.ingredients[iIndex].suppliers.length;
      pisi++
    ) {
      const piSupplier = profile.ingredients[iIndex].suppliers[pisi];
      console.log('SUPPLIER DATA', supplierData);
      console.log('piSuppiler', piSupplier);

      // If there is a supplier that was preferred.. Set it to false
      if (supplierData.preferred) {
        piSupplier.preferred = false;
      } else {
        piSupplier.preferred = false;
      }
      if (piSupplier.supplier.toString() === supplierID.toString()) {
        sIndex = pisi;
        // Return found profile ingredient supplier
        profileIngredientSupplier = piSupplier;
      }
    }

    if (profileIngredientSupplier === null) {
      // Add supplier to profile ingredient suppliers
      profile.ingredients[iIndex].suppliers.push(supplierData);
    } else {
      // Edit profile ingredient supplier
      profile.ingredients[iIndex].suppliers[sIndex] = supplierData;
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

    // Get ingredient suppliers list count to average supplier cost later
    let ingredientSupplierCount;
    // Calculate packetCost from packet grams as 100g
    let inputSupplierPacketCost100g =
      (supplierData.packetCost / supplierData.packetGrams) * 100;

    if (ingredientSupplier.length === 0) {
      // Add supplier to ingredient suppliers list
      ingredient.suppliers.push({
        ...supplierData,
        packetCost: inputSupplierPacketCost100g,
        packetGrams: 100,
        profileSaveCount: 1
      });

      // Update ingredient packet cost average
      // using the average of all the suppliers
      ingredientSupplierCount = ingredient.suppliers.length;

      if (ingredientSupplierCount === 0) {
        ingredient.packetCost = inputSupplierPacketCost100g;
      } else {
        let totalAverageSupplierPacketCost100g = 0;
        for (let is = 0; is < ingredient.suppliers.length; is++) {
          const iSupplier = ingredient.suppliers[is];
          const iSupplier100g = iSupplier.packetCost;
          totalAverageSupplierPacketCost100g =
            totalAverageSupplierPacketCost100g + iSupplier100g;
        }

        ingredient.packetCost =
          totalAverageSupplierPacketCost100g /
          ingredientSupplierCount;
      }
    } else {
      // Times the supplierTotalPacketCost100g by the profileSaveCount so it equals the correct value for the amount it has been saved
      ingredientSupplierCount = ingredient.suppliers.length;
      let supplierTotalPacketCost100g;
      let profileSaveCount;
      if (ingredient.suppliers[sIndex].profileSaveCount === 10) {
        profileSaveCount = 1;

        supplierTotalPacketCost100g =
          ingredient.suppliers[sIndex].packetCost * profileSaveCount;
      } else {
        supplierTotalPacketCost100g =
          ingredient.suppliers[sIndex].packetCost *
          ingredient.suppliers[sIndex].profileSaveCount;

        profileSaveCount =
          ingredient.suppliers[sIndex].profileSaveCount + 1;
      }

      // Get price of ingredient at 100g for new suppliers

      supplierTotalPacketCost100g =
        supplierTotalPacketCost100g + inputSupplierPacketCost100g;

      // Divide total cost by save count
      // The save count resets at 10 and this is why it needs to be checked.
      let supplierPacketCost100g;
      if (ingredient.suppliers[sIndex].profileSaveCount === 10) {
        supplierPacketCost100g = supplierTotalPacketCost100g / 2;
      } else {
        supplierPacketCost100g =
          supplierTotalPacketCost100g / profileSaveCount;
      }

      // Update ingredient supplier
      ingredient.suppliers[sIndex] = {
        supplier: supplierData.supplier,
        packetCost: supplierPacketCost100g,
        profileSaveCount: profileSaveCount
      };

      // console.log(
      //   'ingredient.suppliers[sIndex] ',
      //   ingredient.suppliers[sIndex]
      // );
      // console.log(
      //   'ingredient.suppliers -------',
      //   ingredient.suppliers
      // );

      // Get average ingredient cost across all suppliers
      let totalAverageSupplierPacketCost100g = 0;
      for (let is = 0; is < ingredient.suppliers.length; is++) {
        const iSupplier = ingredient.suppliers[is];
        const iSupplier100g = iSupplier.packetCost;
        totalAverageSupplierPacketCost100g =
          totalAverageSupplierPacketCost100g + iSupplier100g;
      }

      // console.log(
      //   'totalAverageSupplierPacketCost100g',
      //   totalAverageSupplierPacketCost100g
      // );

      // Save ingredient packet cost
      ingredient.packetCost =
        totalAverageSupplierPacketCost100g / ingredientSupplierCount;
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

    const updatedIngredientWithSupplierNames = await Ingredient.findById(
      ingredient._id
    ).populate('suppliers.supplier', ['displayName']);

    // console.log('ingredient', ingredient);
    // console.log(
    //   'updatedIngredientWithSupplierNames',
    //   updatedIngredientWithSupplierNames
    // );

    return res.status(200).json({
      ingredient: updatedIngredientWithSupplierNames,
      supplier,
      profile
    });

    // console.log('INGREDIENT', ingredient);
    // console.log('PROFILE', profile);
    // console.log('SUPPLIER', supplier);

    // Return saved
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
