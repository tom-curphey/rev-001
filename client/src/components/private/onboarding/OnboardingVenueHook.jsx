import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import { addOrEditVenue } from '../venue/venueActions';
import PublicMenu from '../../layout/menu/PublicMenu';
import { Link, Redirect } from 'react-router-dom';
import SelectInput from '../../layout/input/SelectInput';
// import { isEmpty } from '../../../utils/utils';
import logo from '../../../images/recipeRevenuelogo.png';
import { removeErrors } from '../../../redux/errorActions';
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
            <img src={logo} alt="Recipe Revenue Logo" />
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
