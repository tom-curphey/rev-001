import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import { addOrEditVenue } from '../venue/venueActions';
import PublicMenu from '../../layout/menu/PublicMenu';
import { Link, Redirect } from 'react-router-dom';
import SelectInput from '../../layout/input/SelectInput';
import { isEmpty } from '../../../utils/utils';
import PropTypes from 'prop-types';

const OnboardingVenue = ({
  addOrEditVenue,
  history,
  profile,
  errors
}) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    type: ''
  });
  // const [errorData, setErrorData] = useState({});

  // useEffect(() => {
  //   if (!isEmpty(errors)) {
  //     setErrorData(() => errors);
  //   }
  // });

  const { displayName, email, type } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const getSelectedValue = selectedValue => {
    setFormData({
      ...formData,
      type: selectedValue.value
    });
  };

  const handleOnSubmit = async e => {
    e.preventDefault();

    const newVenue = {
      displayName: displayName,
      email: email,
      type: type
    };

    addOrEditVenue(newVenue, history);
  };

  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginRight = '250px';
  };

  if (profile) {
    // console.log('profile', profile);
    if (profile.profile !== null && profile.loading === false) {
      if (profile.profile.venues.length !== 0) {
        // console.log('Redirect', profile.profile.venues);
        return <Redirect to="/recipes" />;
      }
    }
  }

  console.log('errors', errors);

  const options = [
    { value: 'bar', label: 'Bar', className: 'optOpt' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'restraunt', label: 'Restraunt' }
  ];

  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <section className="onboarding">
        <div className="sideImage" />
        <div className="sideContentWrapper">
          <section className="sideContent">
            <img
              src="https://lh3.googleusercontent.com/UVmz4Rr7bCyx93MHZrboetxqmthdW5K3vtLPq7uZsjebDBhc12Qrhfs_WVuCVH-U68VyX7Xyjg_3cWqnxYDDl8L5YxG3KwIRfllFl8yh70u1Jc6XjtmSZoDN4RFBLpsWSTPjtY9tFzwUgM1NrLuI5m1VhBXp5JpscU-EofBgRaVQhGXXyeJQELf-nDWYIteGbvnqJ6wYe6eRDiz49BqO18OG5lMp_Jw3d9g1rSFbsDlQye0Lefsfz1oDwkwto32Jwf1BkWi0i3z42AhKw063_mgtgxvk9OhROn1rsArUgmczdxwY-cuOgk_OHjhtt_ClLgFKwJM6hLnjKbCR8NXx0pr_7eoprI_f3pO57iv6F0z91cbo5ygUNLsGDaouP43GGYXHBEuXLzStxbTW9aLujujJnPfH8oTiiOaEXiY_Jgilml9ePnU7Sm7I0ScwIxAQdvBE8AL6SkljEWtprH4mQvAAcNGfdSQ5HdsnEvB93knMgPpcR5NXe8ca2pzbTFvkgV8zK39WwZ200ffce1wnVWvY2-IBTLFV2bz1mSDdRiD_jXQgB-ysVW9dqPv41Rd-gre7TQuDOJTon5Z6ksjZqy01XRFs5COt9Gw9ZklKnnVpBqKEshoULNjWYlsI5qD_Z63ImDCZcmIYaVG7Y-eYVDxHqcMOghT6=w714-h426-no"
              alt="Recipe Revenue Logo"
            />
            <div>
              {/* <h1>Tell us about your venue</h1> */}
              <p>Tell us about your venue</p>
            </div>

            <form onSubmit={e => handleOnSubmit(e)}>
              <TextInput
                placeholder="What’s the name of your venue?"
                value={displayName}
                name="displayName"
                onChange={e => onChange(e)}
                error={errors.displayName && errors.displayName}
              />
              <TextInput
                placeholder="Venue email address"
                value={email}
                name="email"
                onChange={e => onChange(e)}
                error={errors.email && errors.email}
              />
              <SelectInput
                name="type"
                placeholder="Select venue type..."
                options={options}
                getSelectedValue={getSelectedValue}
                className="selectInput"
                error={errors.type && errors.type}
              />
              <button type="submit" className="orange">
                Let's Go!
              </button>
            </form>
          </section>
        </div>
      </section>
    </PublicMenu>
  );
};

OnboardingVenue.propTypes = {
  addOrEditVenue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = { addOrEditVenue };

const mapState = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(OnboardingVenue);
