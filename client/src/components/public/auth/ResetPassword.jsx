import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  decodeForgotPasswordLink,
  removeResetFormToken,
  resetPassword
} from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { openNav } from '../../../utils/utils';
import { removeErrors } from '../../../redux/errorActions';

class ResetPassword extends Component {
  state = {
    newPassword: '',
    loadForm: false,
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.isAuthenticated) {
      return <Redirect to="/recipes" />;
    }

    if (
      this.props.match.params.id &&
      this.props.match.params.tempToken
    ) {
      const { id, tempToken } = this.props.match.params;
      const payload = {
        id,
        tempToken
      };
      this.props.decodeForgotPasswordLink(payload);
      this.loadForm();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isAuthenticated !== this.props.isAuthenticated &&
      this.props.isAuthenticated
    ) {
      this.props.history.push('/recipes');
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (prevProps.auth !== this.props.auth) {
      console.log('CHECKED');

      this.loadForm();
    }
  }

  componentWillUnmount() {
    console.log('Forgot Password Unmounted');
    this.props.removeErrors();
    this.props.removeResetFormToken();
  }

  loadForm = () => {
    const loadForm = JSON.parse(localStorage.getItem('load-form'));

    console.log('LOAD FORM:', loadForm);
    if (loadForm === true) {
      this.setState({ loadForm: true });
    }
  };

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  handleOnSubmit = e => {
    e.preventDefault();
    const { newPassword } = this.state;
    const { id, tempToken } = this.props.match.params;

    const updatedPasswordPayload = {
      id,
      newPassword,
      tempToken
    };

    console.log('updatedPassword', updatedPasswordPayload);

    this.props.resetPassword(updatedPasswordPayload);
  };

  render() {
    const { newPassword, loadForm, errors } = this.state;

    let PasswordForm;
    if (loadForm) {
      PasswordForm = (
        <Fragment>
          <h1>Update Password</h1>
          <p>
            Please enter in you account email, <br />
            we will then email you the <br />
            password reset link
          </p>
          {/* {errors.signin && (
              <span className="errorMsg pageError">
                {errors.signin}
              </span>
            )} */}
          <form onSubmit={this.handleOnSubmit}>
            <TextInput
              type="password"
              placeholder="Password"
              value={newPassword}
              name="newPassword"
              onChange={this.onChange}
              error={errors.newPassword && errors.newPassword}
            />
            <button>Reset Password</button>
          </form>
        </Fragment>
      );
    } else {
      PasswordForm = <h1>Redirect</h1>;
    }

    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="signin">
          <section className="sideContent">
            <img src={logo} alt="Recipe Revenue Logo" />
            {PasswordForm}
            <Link className="subLink" to="/register">
              <span>Don't have a Recipe Revenue account yet?</span>
              <span>Sign up now.</span>
            </Link>
          </section>
        </section>
      </PublicMenu>
    );
  }
}

ResetPassword.propTypes = {
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  decodeForgotPasswordLink: PropTypes.func.isRequired,
  removeResetFormToken: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  removeErrors: PropTypes.func.isRequired
};

const actions = {
  decodeForgotPasswordLink,
  removeResetFormToken,
  resetPassword,
  removeErrors
};

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(ResetPassword);
