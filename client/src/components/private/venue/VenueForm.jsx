import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { removeErrors } from '../../../redux/errorActions';
// import { setProfileLoading } from './profileActions';
import { isEmptyString } from '../../../utils/utils';
import { addOrEditVenue } from './venueActions';
import Spinner from '../../../utils/Spinner';
import PropTypes from 'prop-types';

class VenueForm extends Component {
  state = {
    updatedVenue: {
      displayName: '',
      type: ''
    },
    errors: null
  };

  componentDidMount() {
    if (
      this.props.venues !== null &&
      this.props.venues.selectedVenue !== null
    ) {
      this.setState({
        updatedVenue: this.props.venues.selectedVenue
      });
    }
  }

  componentDidUpdate(prevProps, state) {
    if (
      prevProps.venues !== this.props.venues &&
      this.props.venues.selectedVenue !== null
    ) {
      this.setState({
        updatedVenue: this.props.venues.selectedVenue
      });
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  componentWillUnmount() {
    console.log('Password Settings Unmounted');
    this.props.removeErrors();
  }

  onChange = e => {
    e.persist();
    this.setState(prevState => ({
      updatedVenue: {
        ...prevState.updatedVenue,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleOnSubmit = e => {
    e.preventDefault();
    // this.props.setPasswordLoading();
    this.props.removeErrors();
    this.props.addOrEditVenue(this.state.updatedVenue);
  };

  render() {
    const { errors, venues } = this.props;
    const { displayName, type } = this.state.updatedVenue;

    let title;
    if (displayName !== '') {
      title = displayName;
    } else {
      if (venues.selectedVenue)
        title = venues.selectedVenue.displayName;
    }

    let formContent;
    if (venues.loading) {
      formContent = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      formContent = (
        <Fragment>
          <h1>{`< ${title}`}</h1>
          <p>
            Provide as much or as little information as you’d like.{' '}
            <br />
            Recipe Revenue will never share or sell individual
            personal information or personally identifiable details.
          </p>
          <form onSubmit={this.handleOnSubmit}>
            <TextInputHorizontal
              label="Venue Name"
              value={displayName}
              name="displayName"
              onChange={this.onChange}
              type="text"
              error={errors.displayName && errors.displayName}
            />
            <TextInputHorizontal
              label="Venue Type"
              value={type}
              name="type"
              onChange={this.onChange}
              type="text"
              error={errors.type && errors.type}
            />
            {/* <TextInputHorizontal
              label="Email"
              value={type}
              name="email"
              onChange={this.onChange}
              type="text"
              error={errors.email && errors.email}
            /> */}
            <div className="button">
              <button type="submit" className="orange">
                Save Profile
              </button>
            </div>
          </form>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <section className="settings venue">{formContent}</section>
      </Fragment>
    );
  }
}

VenueForm.propTypes = {
  removeErrors: PropTypes.func.isRequired,
  venues: PropTypes.object.isRequired
  // setProfileLoading: PropTypes.func.isRequired,
  // updatePassword: PropTypes.func.isRequired
};

const actions = {
  addOrEditVenue,
  removeErrors
};

const mapState = state => ({
  user: state.auth.user,
  venues: state.venues,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(VenueForm);
