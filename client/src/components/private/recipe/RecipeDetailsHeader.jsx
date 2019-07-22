import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { isEmpty } from '../../../utils/utils';
import { updateReduxSelectedRecipe } from './recipeActions';

class RecipeDetailsHeader extends Component {
  state = {
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: ''
    }
  };

  componentDidMount() {
    if (!isEmpty(this.props.selectedRecipe)) {
      const { selectedRecipe } = this.props;
      const recipeData = {
        ...selectedRecipe,
        serves: selectedRecipe.serves
          ? selectedRecipe.serves.toString()
          : '',
        salePricePerServe: selectedRecipe.salePricePerServe
          ? selectedRecipe.salePricePerServe.toString()
          : '',
        expectedSales: selectedRecipe.expectedSales
          ? selectedRecipe.expectedSales.toString()
          : ''
      };

      this.setState({
        selectedRecipe: recipeData
      });
    }
  }

  componentDidUpdate = prevProps => {
    const {
      serves,
      salePricePerServe,
      expectedSales
    } = this.props.selectedRecipe;
    if (!isEmpty(prevProps.selectedRecipe)) {
      if (prevProps.selectedRecipe !== this.props.selectedRecipe) {
        if (
          prevProps.selectedRecipe.serves !== serves ||
          prevProps.selectedRecipe.salePricePerServe !==
            salePricePerServe ||
          prevProps.selectedRecipe.expectedSales !== expectedSales
        ) {
          const recipeData = {
            ...this.props.selectedRecipe,
            serves: serves ? serves.toString() : '',
            salePricePerServe: salePricePerServe
              ? salePricePerServe.toString()
              : '',
            expectedSales: expectedSales
              ? expectedSales.toString()
              : ''
          };

          this.setState({
            selectedRecipe: recipeData
          });
        }
      }
    } else {
      const recipeData = {
        ...this.props.selectedRecipe,
        serves: serves ? serves.toString() : '',
        salePricePerServe: salePricePerServe
          ? salePricePerServe.toString()
          : '',
        expectedSales: expectedSales ? expectedSales.toString() : ''
      };
      this.setState({
        selectedRecipe: recipeData
      });
    }
  };

  handleRecipeNumberChange = e => {
    if (!isEmpty(this.props.selectedRecipe)) {
      e.persist();
      let value = e.target.value;
      if (!isNaN(value) || value === '') {
        this.setState(prevState => ({
          updated: true,
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [e.target.name]: value
          }
        }));
      }
    } else {
      this.props.selectRecipeError();
    }
  };

  updateReduxSelectedRecipeHeader = () => {
    if (!isEmpty(this.props.selectedRecipe)) {
      this.props.updateReduxSelectedRecipe(this.state.selectedRecipe);
    }
  };

  render() {
    const {
      serves,
      salePricePerServe,
      expectedSales
    } = this.state.selectedRecipe;

    return (
      <form onBlur={this.updateReduxSelectedRecipeHeader}>
        <TextInputHorizontal
          label="Recipe Serves"
          value={serves}
          name="serves"
          onChange={this.handleRecipeNumberChange}
          type="text"
          // error={errors.serves && errors.serves}
          labelClass="alignTitleRight"
          inputClass="number"
        />
        <TextInputHorizontal
          label="Sale price per serve"
          value={salePricePerServe}
          name="salePricePerServe"
          onChange={this.handleRecipeNumberChange}
          type="text"
          // error={errors.salePricePerServe && errors.salePricePerServe}
          labelClass="alignTitleRight"
          inputClass="number"
        />
        <TextInputHorizontal
          label="Expected Weekly Serve Sales"
          value={expectedSales}
          name="expectedSales"
          onChange={this.handleRecipeNumberChange}
          type="text"
          // error={errors.expectedSales && errors.expectedSales}
          labelClass="alignTitleRight"
          inputClass="number"
        />
      </form>
    );
  }
}

const actions = {
  updateReduxSelectedRecipe
};

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe
});

export default connect(
  mapState,
  actions
)(RecipeDetailsHeader);
