import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import { loadIngredients } from './ingredientActions';
import SelectIngredient from './SelectIngredient';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';

class Ingredients extends Component {
  state = {
    selectedValue: {
      label: 'Select Ingredient',
      value: 'no-ingredient-selected'
    }
  };

  componentDidMount() {
    console.log('I RAN');
    this.props.loadIngredients();
  }

  componentDidUpdate(prevProps) {
    console.log('props', this.props);
  }

  render() {
    const { ingredients } = this.props;

    let ingredientOptions = [];
    if (
      ingredients.ingredients !== null &&
      ingredients.ingredients.length !== 0
    ) {
      console.log('IN', ingredients);
      ingredientOptions = ingredients.ingredients.map(ingredient => {
        let selectData = {};
        selectData.label = ingredient.displayName;
        selectData.value = ingredient._id;
        return selectData;
      });
    }

    console.log('OPTIONS: ', ingredientOptions);

    let content;
    if (ingredients && ingredients.loading) {
      content = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      content = <SelectIngredient />;
    }

    return (
      <AuthMenu>
        <section className="ingredients">
          <div>
            <h1>Ingredients</h1>
            <h3>Search / Create / Edit</h3>
            {content}
          </div>
          <div>Panel</div>
        </section>
      </AuthMenu>
    );
  }
}

Ingredients.propTypes = {
  ingredients: PropTypes.object,
  loadIngredients: PropTypes.func.isRequired
};

const actions = {
  loadIngredients
};

const mapState = state => ({
  ingredients: state.ingredients
});

export default connect(
  mapState,
  actions
)(Ingredients);
