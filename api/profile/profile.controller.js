const Profile = require('./profile.model');
const User = require('../user/user.model');

module.exports.getProfile = async (req, res) => {
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
