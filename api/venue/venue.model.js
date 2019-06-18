const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueSchema = new Schema(
  {
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
      required: true
    },
    personal: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    },
    type: {
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
    weeksOpenPerYear: {
      type: Number,
      default: 52
    },
    prepTime: {
      type: Number,
      default: 0
    },
    prepTimeUnit: {
      type: String,
      default: 'week'
    },
    totalItemsOnMenu: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    costs: {
      chefCost: {
        type: Number,
        default: 0
      },
      chefUnitCost: {
        type: String,
        default: 'hour'
      },
      rentCost: {
        type: Number,
        default: 0
      },
      rentUnitCost: {
        type: String,
        default: 'month'
      },
      waterCost: {
        type: Number,
        default: 0
      },
      waterUnitCost: {
        type: String,
        default: 'month'
      },
      powerCost: {
        type: Number,
        default: 0
      },
      powerUnitCost: {
        type: String,
        default: 'month'
      },
      insuranceCost: {
        type: Number,
        default: 0
      },
      insuranceUnitCost: {
        type: String,
        default: 'year'
      },
      councilCost: {
        type: Number,
        default: 0
      },
      councilUnitCost: {
        type: String,
        default: 'year'
      },
      wastageCost: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

module.exports = Venue = mongoose.model('venue', VenueSchema);
