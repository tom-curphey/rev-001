const Venue = require('./venue.model');
const Profile = require('../profile/profile.model');
const { validationResult } = require('express-validator/check');

module.exports.getVenue = async (req, res) => {
  try {
    const venue = await Venue.findOne({
      user: req.user.id
    });

    if (!venue) {
      return res
        .status(400)
        .json({ msg: 'There are no venues for this user' });
    }
    return res.status(200).json(venue);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.addOrEditVenue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    displayName,
    email,
    type,
    phone,
    website,
    address,
    weeksOpenPerYear,
    prepTime,
    prepTimeUnit,
    totalMenuItems,
    costs
  } = req.body;

  // Create profile object
  const venueData = {};
  venueData.user = req.user.id;
  if (displayName) venueData.displayName = displayName;
  if (displayName) {
    venueData.displayName = displayName;
    venueData.urlName = displayName
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  if (email) venueData.email = email;
  if (type) venueData.type = type;
  if (phone) venueData.phone = phone;
  if (website) venueData.website = website;
  if (address) venueData.address = address;
  if (weeksOpenPerYear) venueData.weeksOpenPerYear = weeksOpenPerYear;
  if (prepTime) venueData.prepTime = prepTime;
  if (prepTimeUnit) venueData.prepTimeUnit = prepTimeUnit;
  if (totalMenuItems) venueData.totalMenuItems = totalMenuItems;
  // if (costs) venueData.costs = costs;

  try {
    let venue = await Venue.findById(req.body.id);

    if (venue) {
      // Update Venue
      venue = await Venue.findOneAndUpdate(
        { user: req.user.id },
        { $set: venueData },
        { new: true }
      );
      return res.status(200).json(venue);
    }

    // Add Venue
    venue = new Venue(venueData);
    await venue.save();

    const profileData = { venue: venue._id };

    console.log(profileData);

    // var John = people.findOne({ name: 'John' });
    // John.friends.push({ firstName: 'Harry', lastName: 'Potter' });
    // John.save();

    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $push: { venues: profileData } },
      { new: true }
    );
    return res.status(200).json(venue);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
