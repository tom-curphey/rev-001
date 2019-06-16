const Venue = require('./venue.model');
const Profile = require('../profile/profile.model');
const { validationResult } = require('express-validator/check');

module.exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find({
      user: req.user.id
    }).sort({ name: 'asc' });

    if (!venues) {
      return res
        .status(400)
        .json({ msg: 'There are no venues for this user' });
    }
    return res.status(200).json(venues);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

// @TODO Get Selected Venue

module.exports.addOrEditVenue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }
  const {
    displayName,
    personal,
    email,
    type,
    phone,
    website,
    address,
    weeksOpenPerYear,
    prepTime,
    prepTimeUnit,
    totalMenuItems,
    chefCost,
    chefUnitCost,
    rentCost,
    rentUnitCost,
    waterCost,
    waterUnitCost,
    powerCost,
    powerUnitCost,
    insuranceCost,
    insuranceUnitCost,
    councilCost,
    councilUnitCost,
    wastageCost
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
  if (personal) venueData.personal = personal;
  if (email) venueData.email = email;
  if (type) venueData.type = type;
  if (phone) venueData.phone = phone;
  if (website) venueData.website = website;
  if (address) venueData.address = address;
  if (weeksOpenPerYear) venueData.weeksOpenPerYear = weeksOpenPerYear;
  if (prepTime) venueData.prepTime = prepTime;
  if (prepTimeUnit) venueData.prepTimeUnit = prepTimeUnit;
  if (totalMenuItems) venueData.totalMenuItems = totalMenuItems;
  venueData.costs = {};
  if (chefCost) venueData.costs.chefCost = chefCost;
  if (chefUnitCost) venueData.costs.chefUnitCost = chefUnitCost;
  if (rentCost) venueData.costs.rentCost = rentCost;
  if (rentUnitCost) venueData.costs.rentUnitCost = rentUnitCost;
  if (waterCost) venueData.costs.waterCost = waterCost;
  if (waterUnitCost) venueData.costs.waterUnitCost = waterUnitCost;
  if (powerCost) venueData.costs.powerCost = powerCost;
  if (powerUnitCost) venueData.costs.powerUnitCost = powerUnitCost;
  if (insuranceCost) venueData.costs.insuranceCost = insuranceCost;
  if (insuranceUnitCost)
    venueData.costs.insuranceUnitCost = insuranceUnitCost;
  if (councilCost) venueData.costs.councilCost = councilCost;
  if (councilUnitCost)
    venueData.costs.councilUnitCost = councilUnitCost;
  if (wastageCost) venueData.costs.wastageCost = wastageCost;

  try {
    let venues = await Venue.find({ user: req.user.id });
    console.log('Venues', venues);
    console.log('REQ USER......', req.user);

    if (venues.length > 0) {
      // Update Personal Venue
      if (req.body.personal === true) {
        let venue = await Venue.findOneAndUpdate(
          { personal: true },
          { $set: venueData },
          { new: true }
        );
        return res.status(200).json(venue);
      }

      // Update Venue
      if (req.body.id) {
        let venue = await Venue.findOneAndUpdate(
          { _id: req.body.id },
          { $set: venueData },
          { new: true }
        );
        return res.status(200).json(venue);
      }

      // Add New Venue
      let venue = new Venue(venueData);
      await venue.save();
      const profileData = { venue: venue._id };
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $push: { venues: profileData } },
        { new: true }
      );
      return res.status(200).json(venue);
    } else {
      console.log('User Has no venues');
      if (req.body.personal === true) {
        let venue = new Venue(venueData);
        await venue.save();
        const profileData = { venue: venue._id };
        await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $push: { venues: profileData } },
          { new: true }
        );
        return res.status(200).json(venue);
      }
      console.log('Need to add personal venue & account venue');

      // Create Personal Venue data
      const personalVenueData = {
        user: req.user.id,
        displayName: 'Personal',
        urlName: 'personal',
        personal: true,
        email: req.user.email,
        type: 'Personal'
      };

      const profileData = {};

      // Save & add personal venue to profile
      let personalVenue = new Venue(personalVenueData);
      await personalVenue.save();
      profileData.venue = personalVenue._id;
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $push: { venues: profileData } },
        { new: true }
      );

      let venue = new Venue(venueData);
      await venue.save();
      profileData.venue = venue._id;
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $push: { venues: profileData } },
        { new: true }
      );

      return res.status(200).json(venue);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.deactivateVenue = async (req, res) => {
  try {
    const venueData = { active: false };

    // Update
    let venue = await Venue.findOneAndUpdate(
      { user: req.user.id },
      { $set: venueData },
      { new: true }
    );
    if (!venue) {
      return res
        .status(400)
        .json({ msg: 'There is no venue for this user' });
    }
    return res.status(200).json({ msg: 'Venue Deactivated' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.activateVenue = async (req, res) => {
  try {
    const venueData = { active: true };

    // Update
    let venue = await Venue.findOneAndUpdate(
      { user: req.user.id },
      { $set: venueData },
      { new: true }
    );
    if (!venue) {
      return res
        .status(400)
        .json({ msg: 'There is no venue for this user' });
    }
    return res.status(200).json({ msg: 'Venue Activated' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
