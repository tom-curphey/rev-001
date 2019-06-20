import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getForgotPasswordLink } from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { openNav } from '../../../utils/utils';
import { removeErrors } from '../../../redux/errorActions';
import { isEmpty } from '../../../utils/utils';

class ResetPassword extends Component {
  state = {
    email: '',
    tempToken: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.isAuthenticated) {
      return <Redirect to="/recipes" />;
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

    if (
      prevState.tempToken === this.state.tempToken &&
      isEmpty(this.state.tempToken)
    ) {
      this.fetch_temp_token();
    }
  }

  componentWillUnmount() {
    console.log('Forgot Password Unmounted');
    this.props.removeErrors();
  }

  fetch_temp_token = e => {
    const tempToken = JSON.stringify(
      localStorage.getItem('temp-token')
    );

    if (tempToken) {
      // console.log('temp', tempToken);
      this.setState({ tempToken: tempToken });
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
    const { email, errors, tempToken } = this.state;

    console.log('STATE TEMP:', tempToken);

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
              <Link to="/contact-us">Forgot account email?</Link>
              <button>Email Me The Password Reset Link</button>
              {tempToken && (
                <Link to="/contact-us">Forgot account email?</Link>
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

ResetPassword.propTypes = {
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = {
  getForgotPasswordLink,
  removeErrors
};

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(ResetPassword);
