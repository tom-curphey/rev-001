import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
import PropTypes from 'prop-types';
import { openNav } from '../../../utils/utils';
import { register } from './authActions';
import { Link } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { removeErrors } from '../../../redux/errorActions';
import Spinner from '../../layout/Spinner';

class Register extends Component {
  state = {
    firstName: '',
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    // if
    // Redirect if logged in
    const { auth, history } = this.props;

    console.log(
      'this.props.auth.isAuthenticated',
      this.props.auth.isAuthenticated
    );

    if (
      auth.isAuthenticated !== null &&
      auth.isAuthenticated === true
    ) {
      history.push('/onboarding');
    }
  }

  componentDidUpdate(prevProps, state) {
    const { auth, errors } = this.props;

    if (prevProps.errors !== errors) {
      this.setState({ errors: errors });
    }

    if (auth.isAuthenticated === true) {
      this.props.history.push('/onboarding');
    }
  }

  componentWillUnmount() {
    console.log('Register Unmounted');
    this.props.removeErrors();
  }

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  handleOnSubmit = e => {
    e.preventDefault();
    const { firstName, email, password } = this.state;

    const newUser = {
      firstName: firstName,
      email: email,
      password: password
    };

    this.props.register(newUser);
  };

  render() {
    const { firstName, email, password, errors } = this.state;
    const { auth, profile } = this.props;

    let loading;
    if (profile.loading && auth.loading) {
      loading = <Spinner />;
    } else {
      loading = '';
    }

    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="register">
          <div className="sideImage" />
          <div>
            <section className="sideContent">
              <img src={logo} alt="Recipe Revenue Logo" />
              <div>
                <h1>Join Today</h1>
                {errors.register && (
                  <span className="errorMsg pageError">
                    {errors.register}
                  </span>
                )}
                <p>
                  Recipe Revenue helps chefs & eateries to optimise
                  their recipe profits while forcasting revenue.
                </p>
              </div>

              {loading && loading}

              <form onSubmit={this.handleOnSubmit}>
                <TextInput
                  label="First Name"
                  value={firstName}
                  name="firstName"
                  onChange={this.onChange}
                  error={errors.firstName && errors.firstName}
                  autoFocus={true}
                />
                <TextInput
                  label="Personal Email"
                  value={email}
                  name="email"
                  onChange={this.onChange}
                  error={errors.email && errors.email}
                />
                <TextInput
                  label="Password"
                  value={password}
                  name="password"
                  onChange={this.onChange}
                  type="password"
                  error={errors.password && errors.password}
                />
                <button type="submit" className="orange">
                  Get Started
                </button>
              </form>
              <Link className="subLink" to="/signin">
                <span>Have a Recipe Revenue account?</span>
                <span>Sign in.</span>
              </Link>
            </section>
          </div>
        </section>
      </PublicMenu>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  removeErrors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = { register, removeErrors };

const mapState = state => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapState,
  actions
)(Register);
