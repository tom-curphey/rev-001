const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
