import React, { Component } from 'react';
import { connect } from 'react-redux';
import PublicMenu from '../layout/menu/PublicMenu';
import Button from '../layout/menu/Button';
import { withRouter } from 'react-router';
import { openNav } from '../../utils/utils';
import logo from '../../images/recipeRevenuelogo.png';

class Home extends Component {
  handleEnterSite = () => {
    this.props.history.push('/register');
  };
  render() {
    return (
      <PublicMenu>
        <nav className="toggle publicMenu" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
        <section className="onboarding homepage">
          <div className="sideImage" />
          <div className="sideContentWrapper">
            <section className="sideContent">
              <img src={logo} alt="Recipe Revenue Logo" />
              <div>
                {/* <h1>Tell us about your venue</h1> */}
                <h1>Recipe Revenue</h1>
                <Button
                  onClick={this.handleEnterSite}
                  buttonTitle="Enter Test Site"
                  buttonColour="orange"
                />
              </div>
            </section>
          </div>
        </section>
      </PublicMenu>
    );
  }
}

// OnboardingVenue.propTypes = {};

const actions = {};

const mapState = state => ({});

export default connect(
  mapState,
  actions
)(withRouter(Home));
