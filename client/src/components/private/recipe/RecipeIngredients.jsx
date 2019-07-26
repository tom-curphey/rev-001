import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';

class RecipeIngredients extends Component {
  state = {
    selectedRecipe: {}
  };

  componentDidMount() {
    this.setState({
      selectedRecipe: { ...this.props.selectedRecipe }
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.selectedRecipe !== this.props.selectedRecipe) {
      this.setState({
        selectedRecipe: { ...this.props.selectedRecipe }
      });
    }
  };

  render() {
    const { selectedRecipe } = this.state;

    return (
      <section className="recipeIngredients">
        <AccordionBoxWithOpenHeader
          headerText={`Ingredient Results + Analyse ingredients to optimise the profitability of ${
            selectedRecipe.displayName
          }`}
          isOpen={true}
        >
          <ul>
            <li>e</li>
            <li>Ingredient Name</li>
            <li>Recipe Cost</li>
            <li>Recipe Grams</li>
            <li>Contribution</li>
            <li>Packet Cost (kg)</li>
          </ul>
        </AccordionBoxWithOpenHeader>
      </section>
    );
  }
}

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe
});

export default connect(mapState)(RecipeIngredients);
