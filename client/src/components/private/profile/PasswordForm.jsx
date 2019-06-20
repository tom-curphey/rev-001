import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { removeErrors } from '../../../redux/errorActions';
import { setProfileLoading } from './profileActions';
import { updatePassword } from '../../public/auth/authActions';
import Spinner from '../../layout/Spinner';
import PropTypes from 'prop-types';

class PasswordForm extends Component {
  state = {
    password: '',
    newPassword: ''
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, state) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  componentWillUnmount() {
    console.log('Password Settings Unmounted');
    this.props.removeErrors();
  }

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  handleOnSubmit = e => {
    e.preventDefault();
    // this.props.setPasswordLoading();
    this.props.removeErrors();

    const { password, newPassword } = this.state;

    const updatedPassword = {
      password: password,
      newPassword: newPassword
    };

    console.log('updatedPassword', updatedPassword);

    this.props.updatePassword(updatedPassword);
  };

  render() {
    const { errors, profile } = this.props;
    const { password, newPassword } = this.state;

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
            label="Current Password"
            value={password}
            name="password"
            onChange={this.onChange}
            type="password"
            error={errors.password && errors.password}
          />
          <TextInputHorizontal
            label="New Password"
            value={newPassword}
            name="newPassword"
            onChange={this.onChange}
            type="password"
            error={
              (errors.newPassword && errors.newPassword) ||
              (errors.signin && errors.signin)
            }
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
        <section className="settings password">
          <h1>Update Password</h1>
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

PasswordForm.propTypes = {
  removeErrors: PropTypes.func.isRequired,
  setProfileLoading: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired
};

const actions = {
  updatePassword,
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
)(PasswordForm);
