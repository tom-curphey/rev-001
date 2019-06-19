import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { removeErrors } from '../../../redux/errorActions';
// import { setProfileLoading } from './profileActions';
import {
  isEmpty,
  isEmptyString,
  calcCostToSeconds,
  calcCostPerSecondToCostPerUnit,
  setVenueData
} from '../../../utils/utils';
import { addOrEditVenue, loadVenues } from './venueActions';
import Spinner from '../../../utils/Spinner';
import PropTypes from 'prop-types';

class VenueForm extends Component {
  state = {
    updatedVenue: {
      displayName: '',
      type: '',
      prepTime: '',
      prepTimeUnit: 'week',
      totalItemsOnMenu: '',

      weeksOpenPerYear: '',
      email: '',
      phone: '',
      address: '',
      website: '',

      costs: {
        chefCost: '',
        chefUnitCost: '',
        rentCost: '',
        rentUnitCost: '',
        waterCost: '',
        waterUnitCost: '',
        powerCost: '',
        powerUnitCost: '',
        insuranceCost: '',
        insuranceUnitCost: 'year',
        councilCost: '',
        councilUnitCost: 'year'
      }
    },
    errors: null
  };

  componentDidMount() {
    if (
      this.props.venues !== null &&
      this.props.venues.selectedVenue !== null
    ) {
      // console.log(
      //   'this.props..',
      //   this.props.venues.selectedVenue._id
      // );
      this.props.loadVenues(
        null,
        this.props.venues.selectedVenue._id
      );
    }
    // if (
    //   this.props.venues !== null &&
    //   this.props.venues.selectedVenue !== null
    // ) {
    //   console.log(
    //     'this.props.venues.selectedVenue',
    //     this.props.venues.selectedVenue
    //   );
    //   const venue = setVenueData(this.props.venues.selectedVenue);
    //   this.setState({
    //     updatedVenue: venue
    //   });
    // }
  }

  componentDidUpdate(prevProps, state) {
    if (
      prevProps.venues !== this.props.venues &&
      this.props.venues.selectedVenue !== null
    ) {
      const venueData = setVenueData(this.props.venues.selectedVenue);
      this.setState({
        updatedVenue: venueData
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

  handleCostChange = e => {
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal !== -1) {
          value = e.target.value;
        }
        e.persist();
        this.setState(prevState => ({
          ...prevState,
          updatedVenue: {
            ...prevState.updatedVenue,
            costs: {
              ...prevState.updatedVenue.costs,
              [e.target.name]: value
            }
          }
        }));
      }
    } else {
      e.persist();
      this.setState(prevState => ({
        ...prevState,
        updatedVenue: {
          ...prevState.updatedVenue,
          costs: {
            ...prevState.updatedVenue.costs,
            [e.target.name]: value
          }
        }
      }));
    }
    // console.log('STATE: ', this.state);
    // console.log('VALUE: ', value);
  };

  handleOnSubmit = e => {
    e.preventDefault();
    console.log('this.state.updatedVenue: ', this.state.updatedVenue);

    const {
      _id,
      displayName,
      type,
      prepTime,
      prepTimeUnit,
      totalItemsOnMenu,

      weeksOpenPerYear,
      email,
      phone,
      address,
      website,
      costs: {
        chefCost,
        chefUnitCost,
        rentCost,
        rentUnitCost,
        waterCost,
        waterUnitCost,
        powerCost,
        powerUnitCost,
        insuranceCost,
        insuranceUnitCost,
        councilCost,
        councilUnitCost
      }
    } = this.state.updatedVenue;

    const venueData = {
      _id,
      displayName,
      type,
      prepTime,
      prepTimeUnit,
      totalItemsOnMenu,

      email,
      phone,
      address,
      website,
      chefCost: calcCostToSeconds(chefCost, chefUnitCost),
      chefUnitCost,
      rentCost: calcCostToSeconds(rentCost, rentUnitCost),
      rentUnitCost,
      waterCost: calcCostToSeconds(waterCost, waterUnitCost),
      waterUnitCost,
      powerCost: calcCostToSeconds(powerCost, powerUnitCost),
      powerUnitCost,
      insuranceCost: calcCostToSeconds(
        insuranceCost,
        insuranceUnitCost
      ),
      insuranceUnitCost,
      councilCost: calcCostToSeconds(councilCost, councilUnitCost),
      councilUnitCost,
      weeksOpenPerYear
    };

    // console.log('venueData SAVE: ', venueData);
    // console.log('chefCost SAVE: ', chefCost);

    this.props.removeErrors();
    this.props.addOrEditVenue(venueData);
  };

  render() {
    const { errors, venues } = this.props;
    const {
      displayName,
      type,
      prepTime,
      prepTimeUnit,
      totalItemsOnMenu,

      weeksOpenPerYear,
      email,
      phone,
      address,
      website,
      costs: {
        chefCost,
        chefUnitCost,
        rentCost,
        rentUnitCost,
        waterCost,
        waterUnitCost,
        powerCost,
        powerUnitCost,
        insuranceCost,
        insuranceUnitCost,
        councilCost,
        councilUnitCost
      }
    } = this.state.updatedVenue;

    console.log('RENDER: STATE ', this.state.updatedVenue);

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
            <TextInputHorizontal
              label="Venue Prep Time"
              value={prepTime}
              name="prepTime"
              onChange={this.onChange}
              type="text"
              error={errors.prepTime && errors.prepTime}
            />
            <TextInputHorizontal
              label="Total Menu Items"
              value={totalItemsOnMenu}
              name="totalItemsOnMenu"
              onChange={this.onChange}
              type="text"
              error={
                errors.totalItemsOnMenu && errors.totalItemsOnMenu
              }
              labelClass="inputGap"
            />

            <TextInputHorizontal
              label="Email"
              value={email}
              name="email"
              onChange={this.onChange}
              type="text"
              error={errors.email && errors.email}
            />
            <TextInputHorizontal
              label="Phone"
              value={phone}
              name="phone"
              onChange={this.onChange}
              type="text"
              error={errors.phone && errors.phone}
            />
            <TextInputHorizontal
              label="Address"
              value={address}
              name="address"
              onChange={this.onChange}
              type="text"
              error={errors.address && errors.address}
            />
            <TextInputHorizontal
              label="Website"
              value={website}
              name="website"
              onChange={this.onChange}
              type="text"
              error={errors.website && errors.website}
              labelClass="inputGap"
            />

            <TextInputHorizontal
              label="Chef Cost Per Hour"
              value={chefCost}
              name="chefCost"
              onChange={this.handleCostChange}
              type="text"
              error={errors.chefCost && errors.chefCost}
            />
            <div className="button">
              <button type="submit" className="orange">
                Save Venue
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
  loadVenues: PropTypes.func.isRequired,
  addOrEditVenue: PropTypes.func.isRequired,
  removeErrors: PropTypes.func.isRequired,
  venues: PropTypes.object.isRequired
  // setProfileLoading: PropTypes.func.isRequired,
  // updatePassword: PropTypes.func.isRequired
};

const actions = {
  loadVenues,
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
