const User = require('./auth.model');
const Profile = require('../profile/profile.model');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendMail = require('../../config/email/sendMail');

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
      return res.status(400).json({
        errors: [{ param: 'register', msg: 'User already exits' }]
      });
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
        email: user.email,
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

module.exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const updatedUser = {
    email: req.body.email
  };

  let user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: updatedUser },
    { new: true }
  );
  // return res.status(200).json(user);

  // Set the user payload to sign JWT token
  const payload = {
    user: {
      id: user._id,
      email: user.email,
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
};

module.exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  try {
    const { password, newPassword } = req.body;

    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(400).json({
        errors: [{ param: 'signin', msg: 'Invalid Credentials' }]
      });
    }

    // Compare if password entered matches users password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ param: 'signin', msg: 'Invalid Credentials' }]
      });
    }

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the user
    await user.save();

    // Return JSON webtoken
    // When a user registers we want them to be logged in immediately
    // This is why we need to return the JSON web token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
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

module.exports.signinUser = async (req, res) => {
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
      return res.status(400).json({
        errors: [{ param: 'signin', msg: 'Invalid Credentials' }]
      });
    }

    // Compare if password entered matches users password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ param: 'signin', msg: 'Invalid Credentials' }]
      });
    }

    // Set the user payload to sign JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
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

module.exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('::errors', errors);

    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { email } = req.body;

  // Using email, find user from your database.
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        errors: [{ param: 'signin', msg: 'Invalid Credentials' }]
      });
    }
    console.log('EMAIL: ', email);

    const payload = {
      _id: user._id, // User ID from database
      email: user.email
    };

    // TODO: Make this a one-time-use token by using the user's
    // current password hash from the database, and combine it
    // with the user's created date to make a very unique secret key!
    // For example:
    // const secret = user.password + ‘-' + user.created.getTime();

    // Need to sign the token this way to get access it again when user clicks to reset password
    const secret = `${user.password}-${user.createdAt.getTime()}`;
    const tempToken = jwt.sign(payload, secret);
    const userID = user._id;

    const link = `<a href="https://rev001.herokuapp.com/reset-password/${userID}/${tempToken}" >Reset Password</a>`;
    // '<a target="_blank" href={`http://localhost:3000/reset-password/reset-password/${userID}/${tempToken}`}>Reset Password</a>';
    // @todo: send link to users email
    sendMail(link);

    return res.status(200).json({ tempToken, userID });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports.checkForgotPasswordLink = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('::errors', errors);

    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { id, tempToken } = req.body;

  try {
    let user = await User.findById(id);

    // Compare if password entered matches users password

    const secret = `${user.password}-${user.createdAt.getTime()}`;
    var isMatch = jwt.decode(tempToken, secret);

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ param: 'reset', msg: 'Link is invalid' }]
      });
    }
    return res.status(200).json(true);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('::errors', errors);

    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { id, tempToken, newPassword } = req.body;

  try {
    let user = await User.findById(id);

    // Compare if password entered matches users password

    const secret = `${user.password}-${user.createdAt.getTime()}`;
    var isMatch = jwt.decode(tempToken, secret);

    if (!isMatch) {
      return res.status(400).json({
        errors: [{ param: 'reset', msg: 'Link is invalid' }]
      });
    }

    console.log('MATCH!!');

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the user
    await user.save();

    // Return JSON webtoken
    // When a user registers we want them to be logged in immediately
    // This is why we need to return the JSON web token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
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
