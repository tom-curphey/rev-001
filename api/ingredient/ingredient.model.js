const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = Ingredient = mongoose.model(
  'ingredient',
  IngredientSchema
);
