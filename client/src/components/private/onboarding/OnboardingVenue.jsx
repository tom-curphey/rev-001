import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import { addOrEditVenue } from '../venue/venueActions';
import PublicMenu from '../../layout/menu/PublicMenu';
import { Link, Redirect } from 'react-router-dom';
import SelectInput from '../../layout/input/SelectInput';
import { openNav } from '../../../utils/utils';
import logo from '../../../images/recipeRevenuelogo.png';
import { removeErrors } from '../../../redux/errorActions';
import PropTypes from 'prop-types';

class OnboardingVenue extends Component {
  state = {
    displayName: '',
    email: '',
    type: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.isAuthenticated) {
      return <Redirect to="/recipes" />;
    }
  }

  componentDidUpdate(prevProps, state) {
    if (prevProps.profile !== this.props.profile) {
      this.props.history.push('/recipes');
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    // if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
    //   this.props.history.push('/recipes');
    // }
  }

  componentWillUnmount() {
    console.log('Onboarding Venue Unmounted');
    this.props.removeErrors();
  }

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  getSelectedValue = selectedValue => {
    this.setState({
      type: selectedValue.value
    });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { displayName, email, type } = this.state;

    const newVenue = {
      displayName: displayName,
      email: email,
      type: type
    };

    this.props.addOrEditVenue(newVenue);
  };

  render() {
    const { displayName, email, type, errors } = this.state;

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

              <form onSubmit={this.handleOnSubmit}>
                <TextInput
                  placeholder="What’s the name of your venue?"
                  value={displayName}
                  name="displayName"
                  onChange={this.onChange}
                  error={errors.displayName && errors.displayName}
                />
                <TextInput
                  placeholder="Venue email address"
                  value={email}
                  name="email"
                  onChange={this.onChange}
                  error={errors.email && errors.email}
                />
                <SelectInput
                  name="type"
                  placeholder="Select venue type..."
                  options={options}
                  getSelectedValue={this.getSelectedValue}
                  className="selectInput"
                  error={errors.type && errors.type}
                />
                <button type="submit" className="orange">
                  Let's Go!
                </button>
              </form>
              <Link className="subLink" to="/signin">
                <span>
                  Don't need to add a venue? Add one later..
                </span>
                <span>Create personal account</span>
              </Link>
            </section>
          </div>
        </section>
      </PublicMenu>
    );
  }
}

OnboardingVenue.propTypes = {
  addOrEditVenue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeErrors: PropTypes.func.isRequired
};

const actions = { addOrEditVenue, removeErrors };

const mapState = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(OnboardingVenue);
