import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import SelectInputHorizontal from '../../layout/input/SelectInputHorizontal';
import { removeErrors } from '../../../redux/errorActions';
import { updateProfile, setProfileLoading } from './profileActions';
import { updateUser } from '../../public/auth/authActions';
import { isEmptyString } from '../../../utils/utils';
import Spinner from '../../layout/Spinner';
import PropTypes from 'prop-types';

class ProfileForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    position: ''
  };

  componentDidMount() {
    if (this.props.user) {
      const { email } = this.props.user;
      this.setState(prevState => ({
        ...prevState,
        email: isEmptyString(email)
      }));
    }

    if (this.props.profile.profile) {
      const {
        firstName,
        lastName,
        mobile,
        position
      } = this.props.profile.profile;
      this.setState(prevState => ({
        ...prevState,
        firstName: isEmptyString(firstName),
        lastName: isEmptyString(lastName),
        mobile: isEmptyString(mobile),
        position: isEmptyString(position)
      }));
    }
  }

  componentDidUpdate(prevProps, state) {
    if (prevProps.errors !== this.props.errors) {
      console.log('STATE', this.state);

      this.setState({ errors: this.props.errors });
    } else {
      if (prevProps.user !== this.props.user) {
        const { email } = this.props.user;
        this.setState(prevState => ({
          ...prevState,
          email: isEmptyString(email)
        }));
      }

      if (
        prevProps.profile.profile !== this.props.profile.profile &&
        this.props.profile !== null &&
        this.props.profile.profile !== null
      ) {
        console.log('I did it');
        const {
          firstName,
          lastName,
          mobile,
          position
        } = this.props.profile.profile;
        this.setState(prevState => ({
          ...prevState,
          firstName: isEmptyString(firstName),
          lastName: isEmptyString(lastName),
          mobile: isEmptyString(mobile),
          position: isEmptyString(position)
        }));
      }
    }
  }

  componentWillUnmount() {
    console.log('Profile Settings Unmounted');
    this.props.removeErrors();
  }

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

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
        this.setState({
          [e.target.name]: e.target.value
        });
      }
    } else {
      e.persist();
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  handleOnSubmit = e => {
    e.preventDefault();
    this.props.setProfileLoading();
    this.props.removeErrors();

    const {
      firstName,
      lastName,
      email,
      mobile,
      position
    } = this.state;

    const updatedProfile = {
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      position: position
    };

    console.log('updatedProfile', updatedProfile);

    this.props.updateProfile(updatedProfile);

    if (email !== this.props.user.email) {
      console.log('Update User');

      const updatedUser = {
        email: email
      };
      this.props.updateUser(updatedUser);
    }
  };

  getSelectedValue = selectedValue => {
    this.setState({
      position: selectedValue.value
    });
  };

  render() {
    const { errors, profile } = this.props;
    const {
      firstName,
      lastName,
      email,
      mobile,
      position
    } = this.state;

    const positionOptions = [
      { value: 'chef', label: 'Chef' },
      { value: 'head-chef', label: 'Head Chef' },
      { value: 'recipe-developer', label: 'Recipe Developer' },
      { value: 'venue-manager', label: 'Venue Manager' },
      { value: 'venue-owner', label: 'Venue Owner' },
      { value: 'venue-owner-chef', label: 'Venue Owner & Chef' }
    ];

    console.log('postion', position);

    let formContent;
    if (profile.loading) {
      formContent = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      formContent = (
        <form onSubmit={this.handleOnSubmit}>
          <TextInputHorizontal
            label="First Name"
            value={firstName}
            name="firstName"
            onChange={this.onChange}
            error={errors.firstName && errors.firstName}
          />
          <TextInputHorizontal
            label="Last Name"
            value={lastName}
            name="lastName"
            onChange={this.onChange}
            error={errors.lastName && errors.lastName}
          />
          <TextInputHorizontal
            label="Email"
            value={email}
            name="email"
            onChange={this.onChange}
            error={errors.email && errors.email}
          />
          <TextInputHorizontal
            label="Mobile"
            value={mobile.toString()}
            name="mobile"
            onChange={this.handleNumberChange}
            error={errors.mobile && errors.mobile}
          />
          <SelectInputHorizontal
            label="Job Position"
            name="position"
            placeholder="Click To Select..."
            options={positionOptions}
            getSelectedValue={this.getSelectedValue}
            error={errors.position && errors.position}
            value={position}
          />
          <div className="button">
            <button type="submit" className="orange">
              Save Profile
            </button>
          </div>
        </form>
      );
    }

    return (
      <Fragment>
        <section className="settings profile">
          <h1>Profile Settings</h1>
          <p>
            Provide as much or as little information as you’d like.{' '}
            <br />
            Recipe Revenue will never share or sell individual
            personal information or personally identifiable details.
          </p>

          {formContent}
        </section>
      </Fragment>
    );
  }
}

ProfileForm.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  removeErrors: PropTypes.func.isRequired,
  setProfileLoading: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
};

const actions = {
  updateUser,
  updateProfile,
  setProfileLoading,
  removeErrors
};

const mapState = state => ({
  user: state.auth.user,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(ProfileForm);
