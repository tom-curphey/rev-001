import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import SelectInputHorizontal from '../../layout/input/SelectInputHorizontal';
import SelectInput from '../../layout/input/SelectInput';
import { removeErrors } from '../../../redux/errorActions';
// import { setProfileLoading } from './profileActions';
import {
  calcCostToSeconds,
  setVenueData,
  isEmpty
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
      totalMenuItems: '',

      weeksOpen: '',
      weeksOpenUnit: 'year',
      email: '',
      phone: '',
      address: '',
      website: '',

      costs: {
        chefCost: '',
        chefCostUnit: 'hour',
        rentCost: '',
        rentCostUnit: 'month',
        waterCost: '',
        waterCostUnit: 'month',
        powerCost: '',
        powerCostUnit: 'month',
        insuranceCost: '',
        insuranceCostUnit: 'year',
        councilCost: '',
        councilCostUnit: 'year'
      }
    },
    errors: null
  };

  componentDidMount() {
    // console.log('Venues', this.props.venues);

    if (
      this.props.venues !== null &&
      this.props.venues.selectedVenue !== null
    ) {
      if (this.props.match.params.venue_action === 'edit') {
        // console.log(
        //   'this.props',
        //   this.props.match.params.venue_action
        // );

        const venueData = setVenueData(
          this.props.venues.selectedVenue
        );
        this.setState({
          updatedVenue: venueData
        });
      } else {
        console.log('ID', this.props.venues.selectedVenue._id);
        if (!isEmpty(this.props.venues.selectedVenue._id)) {
        }
      }
    } else {
      // console.log(this.props.match);

      this.props.history.push(`/account/venues`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.venues !== this.props.venues &&
      this.props.venues.selectedVenue !== null
    ) {
      const { match, venues, history } = this.props;
      if (
        match.params.venue_action !== 'edit' &&
        !isEmpty(venues.selectedVenue._id)
      ) {
        history.push(
          `/account/venues/edit/${venues.selectedVenue.urlName}`
        );
      } else {
        const venueData = setVenueData(venues.selectedVenue);
        this.setState({
          updatedVenue: venueData
        });
      }
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

  handleNumberChange = e => {
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        // console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal !== -1) {
          value = e.target.value;
        }
        e.persist();
        this.setState(prevState => ({
          updatedVenue: {
            ...prevState.updatedVenue,
            [e.target.name]: e.target.value
          }
        }));
      }
    } else {
      e.persist();
      this.setState(prevState => ({
        updatedVenue: {
          ...prevState.updatedVenue,
          [e.target.name]: e.target.value
        }
      }));
    }
  };

  handleCostChange = e => {
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        // console.log('checkDecimal: ', checkDecimal);
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
      totalMenuItems,

      weeksOpen,
      weeksOpenUnit,
      email,
      phone,
      address,
      website,
      costs: {
        chefCost,
        chefCostUnit,
        rentCost,
        rentCostUnit,
        waterCost,
        waterCostUnit,
        powerCost,
        powerCostUnit,
        insuranceCost,
        insuranceCostUnit,
        councilCost,
        councilCostUnit
      }
    } = this.state.updatedVenue;

    const venueData = {
      _id,
      displayName,
      type,
      weeksOpen,
      weeksOpenUnit,
      prepTime: calcCostToSeconds(prepTime, prepTimeUnit),
      prepTimeUnit,
      totalMenuItems,
      email,
      phone,
      address,
      website,
      chefCost: calcCostToSeconds(chefCost, chefCostUnit),
      chefCostUnit,
      rentCost: calcCostToSeconds(rentCost, rentCostUnit),
      rentCostUnit,
      waterCost: calcCostToSeconds(waterCost, waterCostUnit),
      waterCostUnit,
      powerCost: calcCostToSeconds(powerCost, powerCostUnit),
      powerCostUnit,
      insuranceCost: calcCostToSeconds(
        insuranceCost,
        insuranceCostUnit
      ),
      insuranceCostUnit,
      councilCost: calcCostToSeconds(councilCost, councilCostUnit),
      councilCostUnit
    };

    this.props.removeErrors();
    this.props.addOrEditVenue(venueData);
  };

  getSelectedValue = selectedValue => {
    this.setState(prevState => ({
      updatedVenue: {
        ...prevState.updatedVenue,
        type: selectedValue.value
      }
    }));
  };

  getSelectedUnitValue = (selectedTimeValue, name) => {
    this.setState(prevState => ({
      updatedVenue: {
        ...prevState.updatedVenue,
        [name]: selectedTimeValue.value
      }
    }));
  };

  getSelectedCostUnitValue = (selectedTimeValue, name) => {
    console.log('selectedTimeValue: ', selectedTimeValue);
    console.log('name: ', name);

    this.setState(prevState => ({
      updatedVenue: {
        ...prevState.updatedVenue,
        costs: {
          ...prevState.updatedVenue.costs,
          [name]: selectedTimeValue.value
        }
      }
    }));
  };

  render() {
    const { errors, venues } = this.props;
    const {
      displayName,
      type,
      prepTime,
      prepTimeUnit,
      totalMenuItems,

      weeksOpen,
      weeksOpenUnit,
      email,
      phone,
      address,
      website,
      costs: {
        chefCost,
        // chefCostUnit,
        rentCost,
        rentCostUnit,
        waterCost,
        waterCostUnit,
        powerCost,
        powerCostUnit,
        insuranceCost,
        insuranceCostUnit,
        councilCost,
        councilCostUnit
      }
    } = this.state.updatedVenue;

    // console.log('RENDER: STATE ', this.state.updatedVenue);

    let title;
    if (displayName !== '') {
      title = displayName;
    } else {
      if (venues.selectedVenue)
        title = venues.selectedVenue.displayName;
    }

    const typeOptions = [
      { value: 'bar', label: 'Bar' },
      { value: 'cafe', label: 'Cafe' },
      { value: 'restaurant', label: 'Restaurant' }
    ];

    const weekTimeOptions = [
      { value: 'day', label: 'hours per Day' },
      { value: 'week', label: 'hours per Week' }
    ];

    const yearTimeOptions = [
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' }
    ];
    const yearOnlyTimeOptions = [
      { value: 'year', label: 'per Year' }
    ];

    let formContent;
    if (venues.loading) {
      formContent = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (
        venues.selectedVenue !== null &&
        venues.selectedVenue.urlName === 'personal'
      ) {
        console.log('URL', venues.selectedVenue);
        formContent = (
          <Fragment>
            <h1>{`< ${title}`}</h1>
            <p>
              Your personal account has no venue attached to it..{' '}
              <br />
              <br />
              We will be developing a feature in the near future where
              you can add a venue to the recipes under your personal
              account.
              <br />
              <br />
              Regards, <br />
              Tom Curphey
            </p>
          </Fragment>
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
              <SelectInputHorizontal
                label="Venue Type"
                name="type"
                placeholder="Click To Select..."
                options={typeOptions}
                getSelectedValue={this.getSelectedValue}
                className="selectInput"
                error={errors.type && errors.type}
                value={type}
              />

              <div className="inlineFormField largeSelect">
                <TextInputHorizontal
                  label="Weeks Open"
                  value={weeksOpen}
                  name="weeksOpen"
                  onChange={this.handleNumberChange}
                  type="text"
                  error={errors.weeksOpen && errors.weeksOpen}
                />
                <SelectInput
                  name="weeksOpenUnit"
                  options={yearOnlyTimeOptions}
                  getSelectedValue={this.getSelectedUnitValue}
                  error={errors.weeksOpenUnit && errors.weeksOpenUnit}
                  value={weeksOpenUnit}
                />
              </div>
              <div className="inlineFormField largeSelect">
                <TextInputHorizontal
                  label="Venue Prep Time"
                  value={prepTime}
                  name="prepTime"
                  onChange={this.handleNumberChange}
                  type="text"
                  error={errors.prepTime && errors.prepTime}
                />
                <SelectInput
                  name="prepTimeUnit"
                  options={weekTimeOptions}
                  getSelectedValue={this.getSelectedUnitValue}
                  error={errors.prepTimeUnit && errors.prepTimeUnit}
                  value={prepTimeUnit}
                />
              </div>
              <TextInputHorizontal
                label="Total Menu Items"
                value={totalMenuItems}
                name="totalMenuItems"
                placeholder="that are included in the Venue Prep Time"
                onChange={this.handleNumberChange}
                type="text"
                error={errors.totalMenuItems && errors.totalMenuItems}
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
                onChange={this.handleNumberChange}
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
              <div className="inlineFormField">
                <TextInputHorizontal
                  label="Rent Cost"
                  value={rentCost}
                  name="rentCost"
                  onChange={this.handleCostChange}
                  type="text"
                  error={errors.rentCost && errors.rentCost}
                />
                <SelectInput
                  name="rentCostUnit"
                  options={yearTimeOptions}
                  getSelectedValue={this.getSelectedCostUnitValue}
                  error={errors.rentCostUnit && errors.rentCostUnit}
                  value={rentCostUnit}
                />
              </div>
              <div className="inlineFormField">
                <TextInputHorizontal
                  label="Water Cost"
                  value={waterCost}
                  name="waterCost"
                  onChange={this.handleCostChange}
                  type="text"
                  error={errors.waterCost && errors.waterCost}
                />
                <SelectInput
                  name="waterCostUnit"
                  options={yearTimeOptions}
                  getSelectedValue={this.getSelectedCostUnitValue}
                  error={errors.waterCostUnit && errors.waterCostUnit}
                  value={waterCostUnit}
                />
              </div>
              <div className="inlineFormField">
                <TextInputHorizontal
                  label="Power Cost"
                  value={powerCost}
                  name="powerCost"
                  onChange={this.handleCostChange}
                  type="text"
                  error={errors.powerCost && errors.powerCost}
                />
                <SelectInput
                  name="powerCostUnit"
                  options={yearTimeOptions}
                  getSelectedValue={this.getSelectedCostUnitValue}
                  error={errors.powerCostUnit && errors.powerCostUnit}
                  value={powerCostUnit}
                />
              </div>
              <div className="inlineFormField">
                <TextInputHorizontal
                  label="Insurance Cost"
                  value={insuranceCost}
                  name="insuranceCost"
                  onChange={this.handleCostChange}
                  type="text"
                  error={errors.insuranceCost && errors.insuranceCost}
                />
                <SelectInput
                  name="insuranceCostUnit"
                  options={yearTimeOptions}
                  getSelectedValue={this.getSelectedCostUnitValue}
                  error={
                    errors.insuranceCostUnit &&
                    errors.insuranceCostUnit
                  }
                  value={insuranceCostUnit}
                />
              </div>
              <div className="inlineFormField">
                <TextInputHorizontal
                  label="Council Cost"
                  value={councilCost}
                  name="councilCost"
                  onChange={this.handleCostChange}
                  type="text"
                  error={errors.councilCost && errors.councilCost}
                />
                <SelectInput
                  name="councilCostUnit"
                  options={yearTimeOptions}
                  getSelectedValue={this.getSelectedCostUnitValue}
                  error={
                    errors.councilCostUnit && errors.councilCostUnit
                  }
                  value={councilCostUnit}
                />
              </div>
              <div className="button">
                <button type="submit" className="orange">
                  Save Venue
                </button>
              </div>
            </form>
          </Fragment>
        );
      }
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
)(withRouter(VenueForm));
