import React, { Component, Fragment } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';
import RecipeHeader from './RecipeHeader';
import RecipeResults from './RecipeResults';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import RecipeDetails from './RecipeDetails';

class Recipe extends Component {
  componentDidMount = () => {
    // console.log('Recipe Page Loaded', this.props.venues);

    const { profile, isAuthenticated } = this.props;
    if (isAuthenticated === null || isAuthenticated === false) {
      return <Redirect to="/signin" />;
    }

    if (profile) {
      if (profile.profile !== null && profile.loading === false) {
        if (profile.profile.venues.length === 0) {
          console.log('Redirect? DO YOU NEED THIS?', profile);
          // return this.props.history.push('/onboarding');
        }
      }
    }
  };

  render() {
    const { recipe } = this.props;

    let content;
    if (recipe.loading) {
      content = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (isEmpty(recipe.selectedRecipe) && isEmpty(recipe.recipes)) {
        return <Redirect to="/welcome" />;
      } else {
        content = (
          <Fragment>
            <RecipeHeader />
            <AccordionBoxWithOpenHeader
              headerText="Venue Details + Edit form for operating costs"
              id="venueAccordion"
            >
              <div>Edit the venue</div>
            </AccordionBoxWithOpenHeader>
            <RecipeDetails />
            {/* {!isEmpty(recipe.selectedRecipe) && <RecipeResults />} */}
          </Fragment>
        );
      }
    }

    return (
      <AuthMenu>
        <section className="recipe">{content}</section>
      </AuthMenu>
    );
  }
}

Recipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
  // venues: PropTypes.object.isRequired
};

const mapState = state => ({
  recipe: state.recipe,
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapState)(withRouter(Recipe));
