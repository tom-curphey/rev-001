const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get token from header
  // const token = req.header('x-auth-token');
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    // 401 = Not Authorised
    return res.status(401).json({ msg: 'Authorisation denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    // Set user to the user that is in the decoded token
    req.user = decoded.user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ msg: 'Authorisation token is not valid' });
  }
};
