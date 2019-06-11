import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
// import Alert from '../../layout/alert/Alert';
import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import { register } from './authActions';
import { Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';

const Register = ({
  setAlert,
  register,
  isAuthenticated,
  profile,
  errors
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const [errorData, setErrorData] = useState({});

  useEffect(() => {
    if (!isEmpty(errors)) {
      setErrorData(() => errors);
    }
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
      return <Redirect to="/onboarding" />;
    }
  }

  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <section className="register">
        <div className="sideImage" />
        <div>
          <section className="sideContent">
            <div>
              <h1>Join Today</h1>
              {errors.register && (
                <span className="errorMsg pageError">
                  {errors.register}
                </span>
              )}
              <p>
                Recipe Revenue helps chefs & eateries to optimise
                their recipe profits while forcasting revenue.
              </p>
            </div>

            <form onSubmit={e => handleOnSubmit(e)}>
              <TextInput
                placeholder="First Name"
                value={firstName}
                name="firstName"
                onChange={e => onChange(e)}
                error={errorData.firstName && errorData.firstName}
              />
              <TextInput
                placeholder="Email"
                value={email}
                name="email"
                onChange={e => onChange(e)}
                error={errorData.email && errorData.email}
              />
              <TextInput
                placeholder="Password"
                value={password}
                name="password"
                onChange={e => onChange(e)}
                type="password"
                error={errorData.password && errorData.password}
              />
              <button type="submit" className="orange">
                Get Started
              </button>
            </form>

            <img src={logo} alt="Recipe Revenue Logo" />
          </section>
        </div>
      </section>
    </PublicMenu>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = { setAlert, register };

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(Register);
