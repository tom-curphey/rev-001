import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import Alert from '../../layout/alert/Alert';
import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { register } from './authActions';
import { Redirect } from 'react-router-dom';

const Register = ({ setAlert, register, isAuthenticated }) => {
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

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/recipes" />;
  }

  return (
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
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const actions = { setAlert, register };

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapState,
  actions
)(Register);
