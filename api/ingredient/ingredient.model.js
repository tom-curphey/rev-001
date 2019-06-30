const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IngredientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  displayName: {
    type: String,
    required: true
  },
  urlName: {
    type: String,
    required: true,
    unique: true
  },
  packetCost: {
    type: Number,
    default: 0
  },
  packetGrams: {
    type: Number,
    default: 0
  },
  confirmedDetails: {
    type: Boolean,
    default: false
  },
  metrics: {
    cup: {
      type: Number
      // required: true
    },
    tablespoon: {
      type: Number
    },
    teaspoon: {
      type: Number
    },
    whole: {
      type: Number
    }
  },
  suppliers: [
    {
      supplier: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
        required: true,
        sparse: true
      },
      packetCost: {
        type: Number,
        default: 0
      },
      packetGrams: {
        type: Number,
        default: 100
      },
      profileSaveCount: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = Ingredient = mongoose.model(
  'ingredient',
  IngredientSchema
);
