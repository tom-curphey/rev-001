import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './authActions';
import TextInput from '../../layout/input/TextInput';
import { Link, Redirect } from 'react-router-dom';
import PublicMenu from '../../layout/menu/PublicMenu';
import logo from '../../../images/recipeRevenuelogo.png';
import { openNav } from '../../../utils/utils';
import { removeErrors } from '../../../redux/errorActions';
class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    // Redirect if logged in
    if (this.props.isAuthenticated) {
      return <Redirect to="/recipes" />;
    }
  }

  componentDidUpdate(prevProps, state) {
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.props.history.push('/recipes');
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  componentWillUnmount() {
    console.log('Login Unmounted');
    this.props.removeErrors();
  }

  onChange = e =>
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });

  handleOnSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;

    const user = {
      email: email,
      password: password
    };

    this.props.login(user);
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="login">
          <section className="sideContent">
            <h1>Sign in</h1>
            {errors.signin && (
              <span className="errorMsg pageError">
                {errors.signin}
              </span>
            )}
            <form onSubmit={this.handleOnSubmit}>
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
              <Link to="/forgot">Forgot it?</Link>
              <button>Sign in</button>
              <div>
                <Link to="/forgot">Forgot it?</Link>
              </div>
            </form>
            <img src={logo} alt="Recipe Revenue Logo" />
          </section>
        </section>
      </PublicMenu>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const actions = {
  login,
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
)(Login);
