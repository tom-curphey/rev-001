import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';

const Ingredeint = ({ ingredients }) => {
  let content;
  if (ingredients && ingredients.loading) {
    content = (
      <div style={{ marginTop: '200px' }}>
        <Spinner width="30px" />
      </div>
    );
  } else {
    content = (
      <Fragment>
        <h1>Ingredients</h1>
        <h3>Search / Create / Edit</h3>
      </Fragment>
    );
  }

  return <AuthMenu>{content}</AuthMenu>;
};

Ingredeint.propTypes = {
  ingredients: PropTypes.object.isRequired
};

const mapState = state => ({
  ingredients: state.ingredeints
});

export default connect(mapState)(Ingredeint);
