const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    mobile: {
      type: Number
    },
    position: {
      type: String
    },
    admin: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    },
    venues: [
      {
        venue: {
          type: Schema.ObjectId,
          ref: 'venue',
          required: true
          // unique: true,
          // sparse: true
        }
      }
    ],
    ingredients: [
      {
        ingredient: {
          type: Schema.ObjectId,
          ref: 'ingredient',
          required: true
          // unique: true,
          // sparse: true
        },
        suppliers: [
          {
            supplier: {
              type: Schema.ObjectId,
              ref: 'supplier',
              required: true
            },
            packetCost: {
              type: Number,
              required: true
            },
            packetGrams: {
              type: Number,
              required: true
            },
            preferred: {
              type: Boolean,
              default: false
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
