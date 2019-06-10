import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import Alert from '../../layout/alert/Alert';
import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import { register } from './authActions';
import { Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';

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

            <img
              src="https://lh3.googleusercontent.com/UVmz4Rr7bCyx93MHZrboetxqmthdW5K3vtLPq7uZsjebDBhc12Qrhfs_WVuCVH-U68VyX7Xyjg_3cWqnxYDDl8L5YxG3KwIRfllFl8yh70u1Jc6XjtmSZoDN4RFBLpsWSTPjtY9tFzwUgM1NrLuI5m1VhBXp5JpscU-EofBgRaVQhGXXyeJQELf-nDWYIteGbvnqJ6wYe6eRDiz49BqO18OG5lMp_Jw3d9g1rSFbsDlQye0Lefsfz1oDwkwto32Jwf1BkWi0i3z42AhKw063_mgtgxvk9OhROn1rsArUgmczdxwY-cuOgk_OHjhtt_ClLgFKwJM6hLnjKbCR8NXx0pr_7eoprI_f3pO57iv6F0z91cbo5ygUNLsGDaouP43GGYXHBEuXLzStxbTW9aLujujJnPfH8oTiiOaEXiY_Jgilml9ePnU7Sm7I0ScwIxAQdvBE8AL6SkljEWtprH4mQvAAcNGfdSQ5HdsnEvB93knMgPpcR5NXe8ca2pzbTFvkgV8zK39WwZ200ffce1wnVWvY2-IBTLFV2bz1mSDdRiD_jXQgB-ysVW9dqPv41Rd-gre7TQuDOJTon5Z6ksjZqy01XRFs5COt9Gw9ZklKnnVpBqKEshoULNjWYlsI5qD_Z63ImDCZcmIYaVG7Y-eYVDxHqcMOghT6=w714-h426-no"
              alt="Recipe Revenue Logo"
            />
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
