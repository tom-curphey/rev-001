const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SupplierSchema = new Schema({
  displayName: {
    type: String,
    required: true,
    unique: true
  },
  urlName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  address: {
    type: String
  },
  confirmedDetails: {
    type: Boolean,
    default: false
  },
  ingredients: [
    {
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: 'ingredient',
        required: true
      }
    }
  ]
});

module.exports = Supplier = mongoose.model(
  'supplier',
  SupplierSchema
);
