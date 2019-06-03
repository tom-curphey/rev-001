const Recipe = require('./recipe.model');

module.exports.getRecipes = (req, res) => {
  console.log('Recipe Controller');

  Recipe.find().then(recipes => {
    if (recipes) {
      return res.status(200).json(recipes);
    } else {
      return res.status(404).json({ message: 'No items found' });
    }
  });
};
