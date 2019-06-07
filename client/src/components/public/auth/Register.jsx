import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import Alert from '../../layout/alert/Alert';
import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { register } from './authActions';

const Register = ({ setAlert, register }) => {
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
  register: PropTypes.func.isRequired
};

const actions = { setAlert, register };

export default connect(
  null,
  actions
)(Register);
