import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { isEmpty } from '../../../utils/utils';
import graphIcon from '../../../images/graph.svg';
import moneyIcon from '../../../images/money.svg';
import carrotBlackIcon from '../../../images/carrotBlack.svg';

class RecipeResults extends Component {
  state = {
    selectedRecipe: {
      salePricePerServe: ''
    }
  };

  componentDidMount() {
    console.log(
      'this.props.selectedRecipe.salePricePerServe',
      this.props.selectedRecipe.salePricePerServe
    );

    const { selectedRecipe } = this.props;
    const recipeData = {
      ...selectedRecipe,
      salePricePerServe: selectedRecipe.salePricePerServe
        ? selectedRecipe.salePricePerServe.toString()
        : ''
    };

    this.setState({
      selectedRecipe: recipeData
    });
  }

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

  render() {
    const { salePricePerServe } = this.state.selectedRecipe;
    const { selectedRecipe } = this.props;

    // console.log('selectedRecipe', selectedRecipe);

    return (
      <AccordionBoxWithOpenHeader
        headerText={`Recipe Results + Complete analysis of the ${
          selectedRecipe.displayName
        } recipe`}
      >
        <section className="recipeResults">
          <div className="resultsForm">
            <form>
              <TextInputHorizontal
                label="Sale price per serve"
                value={salePricePerServe}
                name="salePricePerServe"
                onChange={this.handleRecipeNumberChange}
                type="text"
                // error={errors.salePricePerServe && errors.salePricePerServe}
                // labelClass="alignTitleRight"
                inputClass="number"
              />
            </form>
            <p>Recomended Sales Price $16.10</p>
          </div>
          <h3>
            Recipe Results are based off selling 10 serves per day at
            $17.50
          </h3>
          <div className="resultsData">
            <ul className="recipeProfits">
              <li>
                <img
                  src={graphIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p>Profit Per Serve</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Recipe Profit (net)</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Recipe Revenue (gross)</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Profit Margin</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Recipe Mark up</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Recipe Grams</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Grams Per Serve</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Recipe Time</p>
                <p>$7.42</p>
              </li>
            </ul>
            <ul className="recipeCosts">
              <li>
                <img
                  src={moneyIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p>Cost Per Serve</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Total Recipe Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Ingredient Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Staff Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Rent Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Power Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Water Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Insurance Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Council Cost</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Wastage Cost</p>
                <p>$7.42</p>
              </li>
            </ul>
            <ul className="recipeProjections">
              <li>
                <img
                  src={carrotBlackIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p>Profit Per Week</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Profit Per Month</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Profit Per Year</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Revenue Per Week</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Revenue Per Month</p>
                <p>$7.42</p>
              </li>
              <li>
                <p>Revenue Per Year</p>
                <p>$7.42</p>
              </li>
            </ul>
          </div>
        </section>
      </AccordionBoxWithOpenHeader>
    );
  }
}

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe
});

export default connect(mapState)(RecipeResults);
