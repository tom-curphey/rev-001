import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';

const Login = ({ login, isAuthenticated }, profile) => {
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
        <section className="sideContent">
          <h1>Sign in</h1>
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
            <Link to="/forgot">Forgot it?</Link>
            <button>Sign in</button>
          </form>
          <img
            src="https://lh3.googleusercontent.com/UVmz4Rr7bCyx93MHZrboetxqmthdW5K3vtLPq7uZsjebDBhc12Qrhfs_WVuCVH-U68VyX7Xyjg_3cWqnxYDDl8L5YxG3KwIRfllFl8yh70u1Jc6XjtmSZoDN4RFBLpsWSTPjtY9tFzwUgM1NrLuI5m1VhBXp5JpscU-EofBgRaVQhGXXyeJQELf-nDWYIteGbvnqJ6wYe6eRDiz49BqO18OG5lMp_Jw3d9g1rSFbsDlQye0Lefsfz1oDwkwto32Jwf1BkWi0i3z42AhKw063_mgtgxvk9OhROn1rsArUgmczdxwY-cuOgk_OHjhtt_ClLgFKwJM6hLnjKbCR8NXx0pr_7eoprI_f3pO57iv6F0z91cbo5ygUNLsGDaouP43GGYXHBEuXLzStxbTW9aLujujJnPfH8oTiiOaEXiY_Jgilml9ePnU7Sm7I0ScwIxAQdvBE8AL6SkljEWtprH4mQvAAcNGfdSQ5HdsnEvB93knMgPpcR5NXe8ca2pzbTFvkgV8zK39WwZ200ffce1wnVWvY2-IBTLFV2bz1mSDdRiD_jXQgB-ysVW9dqPv41Rd-gre7TQuDOJTon5Z6ksjZqy01XRFs5COt9Gw9ZklKnnVpBqKEshoULNjWYlsI5qD_Z63ImDCZcmIYaVG7Y-eYVDxHqcMOghT6=w714-h426-no"
            alt="Recipe Revenue Logo"
          />
        </section>
      </section>
    </PublicMenu>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired
};

const actions = {
  login
};

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(Login);
