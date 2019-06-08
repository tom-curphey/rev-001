import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleOnSubmit = e => {
    e.preventDefault();

    const user = {
      email: email,
      password: password
    };

    login(user);
  };

  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginRight = '250px';
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/recipes" />;
  }

  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <section className="login">
        <form onSubmit={e => handleOnSubmit(e)}>
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
          <Link to="register">Signup</Link>
          <button>Login</button>
        </form>
      </section>
    </PublicMenu>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const actions = {
  login
};

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapState,
  actions
)(Login);
