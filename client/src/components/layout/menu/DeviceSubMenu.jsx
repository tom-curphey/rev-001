import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DeviceSubMenu = ({ auth: { isAuthenticated, loading } }) => {
  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
  };
  const authLinks = (
    <Fragment>
      <span className="closebtn" onClick={closeNav}>
        &times;
      </span>
      <Link to="/recipes">Recipes</Link>
      <Link to="!#">Ingredients</Link>
      <Link to="!#">Packaging</Link>
      <Link to="/landing">Landing</Link>
    </Fragment>
  );

  const publicLinks = (
    <Fragment>
      <span className="closebtn" onClick={closeNav}>
        &times;
      </span>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/pricing">Pricing</Link>
    </Fragment>
  );

  return (
    <div id="mySidenav" className="sidenav">
      {!loading && (
        <Fragment>
          {isAuthenticated ? authLinks : publicLinks}
        </Fragment>
      )}
    </div>
  );
};

DeviceSubMenu.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapState = state => ({
  auth: state.auth
});

export default connect(mapState)(DeviceSubMenu);
