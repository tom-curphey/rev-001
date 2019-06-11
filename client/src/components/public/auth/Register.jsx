import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from '../../layout/input/TextInput';
// import Alert from '../../layout/alert/Alert';
// import { setAlert } from '../../layout/alert/alertActions';
import PropTypes from 'prop-types';
import { openNav } from '../../../utils/utils';
import { register } from './authActions';
import { Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { removeErrors } from '../../../redux/errorActions';

class Register extends Component {
  state = {
    firstName: '',
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.isAuthenticated) {
      return <Redirect to="/onboarding" />;
    }
  }

  componentDidUpdate(prevProps, state) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
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
    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="register">
          <div className="sideImage" />
          <div>
            <section className="sideContent">
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

              <form onSubmit={this.handleOnSubmit}>
                <TextInput
                  placeholder="First Name"
                  value={firstName}
                  name="firstName"
                  onChange={this.onChange}
                  error={errors.firstName && errors.firstName}
                />
                <TextInput
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={this.onChange}
                  error={errors.email && errors.email}
                />
                <TextInput
                  placeholder="Password"
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

              <img src={logo} alt="Recipe Revenue Logo" />
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
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(Register);
