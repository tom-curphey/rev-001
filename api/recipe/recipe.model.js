const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = Recipe = mongoose.model('recipe', RecipeSchema);
