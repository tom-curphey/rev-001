import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { isEmpty } from '../../../utils/utils';

const Login = ({ login, isAuthenticated, errors, profile }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const [errorData, setErrorData] = useState({});

  // useEffect(() => {
  //   if (!isEmpty(errors)) {
  //     setErrorData(() => errors);
  //   }
  // });

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

  // console.log('errData', errorData);

  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <section className="login">
        <section className="sideContent">
          <h1>Sign in</h1>
          {errors.signin && (
            <span className="errorMsg pageError">
              {errors.signin}
            </span>
          )}
          <form onSubmit={e => handleOnSubmit(e)}>
            <TextInput
              placeholder="Email"
              value={email}
              name="email"
              onChange={e => onChange(e)}
              error={errors.email && errors.email}
            />
            <TextInput
              placeholder="Password"
              value={password}
              name="password"
              onChange={e => onChange(e)}
              type="password"
              error={errors.password && errors.password}
            />
            <Link to="/forgot">Forgot it?</Link>
            <button>Sign in</button>
          </form>
          <img src={logo} alt="Recipe Revenue Logo" />
        </section>
      </section>
    </PublicMenu>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = {
  login
};

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(Login);
