import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';

const Recipes = ({ profile, isAuthenticated, recipe }) => {
  if (isAuthenticated === null || isAuthenticated === false) {
    return <Redirect to="/signin" />;
  }

  if (profile) {
    // console.log('profile', profile);
    if (profile.profile !== null && profile.loading === false) {
      if (profile.profile.venues.length === 0) {
        // console.log('Redirect', profile.profile.venues);
        return <Redirect to="/onboarding" />;
      }
    }
  }

  let content;
  if (recipe.loading) {
    content = (
      <div style={{ marginTop: '200px' }}>
        <Spinner width="30px" />
      </div>
    );
  } else {
    if (recipe.selectedRecipe === null && isEmpty(recipe.recipes)) {
      return <Redirect to="/welcome" />;
    } else {
      content = (
        <Fragment>
          <h1>Add Recipe</h1>
        </Fragment>
      );
    }
  }

  return (
    <AuthMenu>
      <section className="recipe">{content}</section>
    </AuthMenu>
  );
};

Recipes.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  venues: PropTypes.object.isRequired
};

// const actions = {
//   loadVenues
// };

const mapState = state => ({
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  venues: state.venues,
  recipe: state.recipe
});

export default connect(mapState)(withRouter(Recipes));
