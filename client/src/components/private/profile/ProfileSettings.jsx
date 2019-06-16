import React, { Component } from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { removeErrors } from '../../../redux/errorActions';
import { updateProfile, setProfileLoading } from './profileActions';
import { updateUser } from '../../public/auth/authActions';
import { isEmptyString } from '../../../utils/utils';
import Spinner from '../../../utils/Spinner';
import PropTypes from 'prop-types';

class ProfileSettings extends Component {
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

    console.log('PROFILE -->', this.props.profile);

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
    if (prevProps.user !== this.props.user) {
      const { email } = this.props.user;
      this.setState(prevState => ({
        ...prevState,
        email: isEmptyString(email)
      }));
    }

    if (
      prevProps.profile !== this.props.profile &&
      this.props.profile !== null
    ) {
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

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
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
    this.props.updateProfile(updatedProfile);

    if (email !== this.props.user.email) {
      console.log('Update User');

      const updatedUser = {
        email: email
      };
      this.props.updateUser(updatedUser);
    }
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
            onChange={this.onChange}
            error={errors.mobile && errors.mobile}
          />
          <TextInputHorizontal
            label="Job Position"
            value={position}
            name="position"
            onChange={this.onChange}
            error={errors.position && errors.position}
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
      <AuthMenu>
        <AccountMenu />
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
      </AuthMenu>
    );
  }
}

ProfileSettings.propTypes = {
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
)(ProfileSettings);
