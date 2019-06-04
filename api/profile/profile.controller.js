const Profile = require('./profile.model');
const User = require('../user/user.model');
const { validationResult } = require('express-validator/check');

module.exports.getProfile = async (req, res) => {
  console.log('USER', req.user);

  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['email']);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, mobile, position } = req.body;

  // Create profile object
  const profileData = {};
  profileData.user = req.user.id;
  if (firstName) profileData.firstName = firstName;
  if (lastName) profileData.lastName = lastName;
  if (mobile) profileData.mobile = mobile;
  if (position) profileData.position = position;

  try {
    // Update
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true }
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.deactivateProfile = async (req, res) => {
  try {
    const profileData = { active: false };

    // Update
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true }
    );
    // Deactivate User
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: profileData },
      { new: true }
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user' });
    }
    return res.status(200).json({ msg: 'Profile Deactivated' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};

module.exports.activateProfile = async (req, res) => {
  try {
    const profileData = { active: true };

    // Update
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true }
    );
    // Activate User
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: profileData },
      { new: true }
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user' });
    }
    return res.status(200).json({ msg: 'Profile Activated' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Sever Error');
  }
};
