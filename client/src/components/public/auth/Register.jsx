import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import Alert from '../../layout/alert/Alert';
import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { register } from './authActions';
import { Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';

const Register = ({
  setAlert,
  register,
  isAuthenticated,
  profile
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });

  const { firstName, email, password } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleOnSubmit = async e => {
    e.preventDefault();

    if (firstName === '') {
      setAlert('First Name is required', 'error');
    }

    const newUser = {
      firstName: firstName,
      email: email,
      password: password
    };

    register(newUser);
  };

  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginRight = '250px';
  };

  // Redirect if logged in
  if (isAuthenticated) {
    if (
      profile.profile !== null &&
      profile.profile.venues.length > 0
    ) {
      return <Redirect to="/recipes" />;
    } else {
      return <Redirect to="/landing" />;
    }
  }

  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <section className="register">
        <Alert />
        <form onSubmit={e => handleOnSubmit(e)}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            name="firstName"
            onChange={e => onChange(e)}
          />
          <TextInput
            placeholder="Email"
            value={email}
            name="email"
            onChange={e => onChange(e)}
          />
          <TextInput
            placeholder="Password"
            value={password}
            name="password"
            onChange={e => onChange(e)}
            type="password"
          />
          <button>Get Started</button>
        </form>
      </section>
    </PublicMenu>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired
};

const actions = { setAlert, register };

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(Register);
