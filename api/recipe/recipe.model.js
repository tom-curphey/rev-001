const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
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
    serves: {
      type: Number,
      default: 1
    },
    salePricePerServe: {
      type: Number
    },
    staffTime: {
      type: Number
    },
    staffTimeUnit: {
      type: String
    },
    totalCookingTime: {
      type: Number
    },
    cookingTimeUnit: {
      type: String
    },
    expectedSales: {
      type: Number
    },
    expectedSalesUnit: {
      type: String,
      default: 'week'
    },
    totalGrams: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 0
    },
    venues: [
      {
        venue: {
          type: Schema.Types.ObjectId,
          ref: 'venue',
          required: true
        }
      }
    ],
    processTime: [
      {
        description: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          default: 0
        },
        unit: {
          type: String,
          required: true
        },
        total: {
          type: Number,
          default: 0
        },
        staffTime: {
          type: Boolean,
          default: false
        },
        order: {
          type: Number,
          required: true
        }
      }
    ],
    ingredients: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: 'ingredient',
          required: true
        },
        cup: {
          type: Number,
          default: 0
        },
        whole: {
          type: Number,
          default: 0
        },
        quantity: {
          type: Number,
          default: 0
        },
        unit: {
          type: String,
          required: true
        },
        total: {
          type: Number,
          default: 0
        },
        order: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Recipe = mongoose.model('recipe', RecipeSchema);
