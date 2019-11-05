import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import {
  addOrEditVenue,
  addPersonalVenue
} from '../venue/venueActions';
import PublicMenu from '../../layout/menu/PublicMenu';
import { withRouter } from 'react-router';
import SelectInputBorder from '../../layout/input/SelectInputBorder';
import { openNav } from '../../../utils/utils';
import logo from '../../../images/recipeRevenuelogo.png';
import { removeErrors } from '../../../redux/errorActions';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import Spinner from '../../layout/Spinner';
import LoadingPage from '../../layout/LoadingPage';

class OnboardingVenue extends Component {
  state = {
    profileLoading: false,
    displayName: '',
    email: '',
    type: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    // if (this.props.isAuthenticated) {
    //   this.props.history.push('/register');
    // }
    const { auth, profile, history } = this.props;

    if (!auth.loading && !profile.loading) {
      if (
        auth.isAuthenticated === null ||
        auth.isAuthenticated === false
      ) {
        console.log('Props', this.props);
        // this.props.history.push('/register');
      }

      if (!isEmpty(profile.profile)) {
        if (!isEmpty(profile.profile.venues)) {
          history.push('/recipes');
        }
      }
    }
  }

  componentDidUpdate(prevProps, state) {
    // if (prevProps.profile !== this.props.profile) {
    //   console.log('I did it');

    //   this.props.history.push('/recipes');
    // }

    const { auth, profile, history } = this.props;

    if (prevProps.profile !== profile && profile.loading) {
      this.setState({ profileLoading: true });
    }

    if (!profile.loading) {
      if (!isEmpty(profile.profile) && !auth.laoding) {
        if (
          auth.isAuthenticated === true &&
          !isEmpty(profile.profile.venues)
        ) {
          history.push('/recipes');
        }
      }
    }

    if (!auth.loading) {
      if (
        auth.isAuthenticated === false ||
        auth.isAuthenticated === null
      ) {
        this.props.history.push('/register');
      }
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({
        errors: this.props.errors,
        profileLoading: false
      });
    }
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
    console.log('selectedValue.value', selectedValue.value);

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

  handlePersonalSubmit = e => {
    e.preventDefault();

    const userEmail = this.props.profile.profile.user.email;

    this.props.addPersonalVenue(userEmail);
  };

  render() {
    const {
      displayName,
      email,
      type,
      errors,
      profileLoading
    } = this.state;
    const { auth, profile } = this.props;

    const options = [
      { value: 'bar', label: 'Bar', className: 'optOpt' },
      { value: 'cafe', label: 'Cafe' },
      { value: 'drink', label: 'Drink Retail' },
      { value: 'retail', label: 'Food Retail' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'restaurant', label: 'Restaurant' }
    ];

    let loading;
    if (profile.loading || auth.loading) {
      loading = <Spinner />;
    } else {
      loading = '';
    }

    if (profileLoading) {
      return <LoadingPage />;
    } else {
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

                {loading && loading}

                <form onSubmit={this.handleOnSubmit}>
                  <TextInput
                    label="Venue Name"
                    value={displayName}
                    name="displayName"
                    onChange={this.onChange}
                    error={errors.displayName && errors.displayName}
                    autoFocus={true}
                  />
                  <TextInput
                    label="Venue Email"
                    value={email}
                    name="email"
                    onChange={this.onChange}
                    error={errors.email && errors.email}
                  />
                  <SelectInputBorder
                    name="type"
                    inputLabel="Business Type"
                    label="Select venue type..."
                    options={options}
                    value={type}
                    getSelectedValue={this.getSelectedValue}
                    error={errors.type && errors.type}
                  />
                  <button type="submit" className="orange">
                    Let's Go!
                  </button>
                </form>
                <div
                  className="subLink"
                  to="/signin"
                  onClick={this.handlePersonalSubmit}
                >
                  <span>
                    Don't need to add a venue? Add one later..
                  </span>
                  <span>Create personal account</span>
                </div>
              </section>
            </div>
          </section>
        </PublicMenu>
      );
    }
  }
}

OnboardingVenue.propTypes = {
  addOrEditVenue: PropTypes.func.isRequired,
  addPersonalVenue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeErrors: PropTypes.func.isRequired
};

const actions = { addOrEditVenue, addPersonalVenue, removeErrors };

const mapState = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(withRouter(OnboardingVenue));
