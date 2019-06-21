import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getForgotPasswordLink,
  removeResetTokens
} from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { openNav } from '../../../utils/utils';
import { removeErrors } from '../../../redux/errorActions';
import { isEmpty } from '../../../utils/utils';

class ForgotPassword extends Component {
  state = {
    userID: '',
    email: '',
    tempToken: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/recipes" />;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.auth.isAuthenticated !==
        this.props.auth.isAuthenticated &&
      this.props.auth.isAuthenticated
    ) {
      this.props.history.push('/recipes');
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.auth.token !== this.props.auth.token &&
      this.props.auth.token === true &&
      isEmpty(this.state.tempToken)
    ) {
      this.fetch_temp_tokens();
    }
  }

  componentWillUnmount() {
    console.log('Forgot Password Unmounted');
    // this.props.removeErrors();
    this.props.removeResetTokens();
  }

  fetch_temp_tokens = e => {
    const tempToken = JSON.stringify(
      localStorage.getItem('temp-token')
    );
    const userID = JSON.stringify(localStorage.getItem('user-id'));

    if (!isEmpty(tempToken) && !isEmpty(userID)) {
      this.setState({ tempToken: tempToken, userID: userID });
    }
  };

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  handleOnSubmit = e => {
    e.preventDefault();
    const { email } = this.state;

    const emailToCheck = {
      email
    };

    this.props.getForgotPasswordLink(emailToCheck);
  };

  render() {
    const { email, errors, tempToken, userID } = this.state;

    // console.log('STATE TEMP:', tempToken);
    // console.log('STATE USEID:', userID);

    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="signin">
          <section className="sideContent">
            <img src={logo} alt="Recipe Revenue Logo" />
            <h1>Password Reset</h1>
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
                placeholder="Email"
                value={email}
                name="email"
                onChange={this.onChange}
                error={
                  (errors.email && errors.email) ||
                  (errors.signin && errors.signin)
                }
              />
              <Link to="/contact-us">Forgot Account Email?</Link>
              <button>Send Password Reset Link</button>
              {tempToken && userID && (
                <Link
                  to={`/reset-password/${userID.replace(
                    /['"]+/g,
                    ''
                  )}/${tempToken.replace(/['"]+/g, '')}`}
                >
                  Reset Password Link
                </Link>
              )}
            </form>
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

ForgotPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getForgotPasswordLink: PropTypes.func.isRequired,
  removeResetTokens: PropTypes.func.isRequired,
  removeErrors: PropTypes.func.isRequired
};

const actions = {
  getForgotPasswordLink,
  removeResetTokens,
  removeErrors
};

const mapState = state => ({
  auth: state.auth,

  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(ForgotPassword);
