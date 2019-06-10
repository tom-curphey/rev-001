const User = require('./auth.model');
const Profile = require('../profile/profile.model');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exits' }] });
    }

    // Create a new instance of a user
    user = new User({
      email: email,
      password: password
    });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const profile = new Profile({
      user: user._id,
      firstName: req.body.firstName
    });

    await profile.save();

    // Save the user
    await user.save();

    // Return JSON webtoken
    // When a user registers we want them to be logged in immediately
    // This is why we need to return the JSON web token
    const payload = {
      user: {
        id: user._id,
        active: user.active
      }
    };

    // Sign the JWT token
    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 64800 },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json(user);
  } catch (err) {
    // console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare if password entered matches users password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Set the user payload to sign JWT token
    const payload = {
      user: {
        id: user._id,
        active: user.active
      }
    };

    // Sign the JWT token
    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 64800 },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      }
    );
  } catch (err) {
    // console.error(err);
    return res.status(500).send('Server Error');
  }
};
