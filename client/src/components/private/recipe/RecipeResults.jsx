import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { updateReduxSelectedRecipe } from './recipeActions';
import AccordionBoxWithOpenHeader from '../../layout/AccordionBoxWithOpenHeader';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import {
  isEmpty,
  getRecipeResults,
  roundNumber
} from '../../../utils/utils';
import graphIcon from '../../../images/graph.svg';
import moneyIcon from '../../../images/money.svg';
import carrotBlackIcon from '../../../images/carrotBlack.svg';

class RecipeResults extends Component {
  state = {
    selectedRecipe: {
      salePricePerServe: ''
    },
    recipeResults: {
      ingredientCost: '-',
      staffCost: '-',
      venueCosts: {},
      stats: {}
    },
    updated: false
  };

  componentDidMount() {
    // console.log(
    //   'this.props.selectedRecipe.salePricePerServe',
    //   this.props.selectedRecipe.salePricePerServe
    // );

    const {
      selectedRecipe,
      selectedVenue,
      ingredients,
      profile
    } = this.props;

    const recipeData = {
      ...selectedRecipe,
      salePricePerServe: selectedRecipe.salePricePerServe
        ? selectedRecipe.salePricePerServe.toString()
        : ''
    };

    console.log('selectedRecipe', selectedRecipe);
    const recipeResults = getRecipeResults(
      selectedRecipe,
      selectedVenue,
      ingredients,
      profile
    );

    // console.log('recipeResults', recipeResults);
    // console.log('selectedRecipe', selectedRecipe);

    this.setState({
      selectedRecipe: recipeData,
      recipeResults: recipeResults
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      selectedRecipe,
      selectedVenue,
      ingredients,
      profile
    } = this.props;

    if (
      prevProps.selectedRecipe !== selectedRecipe ||
      prevProps.selectedVenue !== selectedVenue ||
      prevProps.ingredients !== ingredients ||
      prevProps.profile !== profile
    ) {
      const recipeData = {
        ...selectedRecipe,
        salePricePerServe: selectedRecipe.salePricePerServe
          ? selectedRecipe.salePricePerServe.toString()
          : ''
      };

      const recipeResults = getRecipeResults(
        selectedRecipe,
        selectedVenue,
        ingredients,
        profile
      );

      console.log('recipeResults', recipeResults);

      this.setState({
        selectedRecipe: recipeData,
        recipeResults: recipeResults
      });
    }

    if (
      prevState.selectedRecipe !== this.state.selectedRecipe &&
      this.state.updated === true
    ) {
      console.log('checking3', this.state.selectedRecipe);
      this.props.updateReduxSelectedRecipe(this.state.selectedRecipe);
      this.setState({ updated: false });
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

  render() {
    const { salePricePerServe } = this.state.selectedRecipe;
    const { recipeResults } = this.state;
    const { selectedRecipe } = this.props;

    // console.log('recipeResults', recipeResults);

    // console.log('selectedRecipe - render from redux', selectedRecipe);

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
                // onBlur={this.updateReduxSelectedRecipe}
              />
            </form>
            <p>
              {recipeResults.stats.markup
                ? `Cost Base Recomended Sales Price $${roundNumber(
                    recipeResults.stats.recommendedSalesPrice
                  )}`
                : ''}
            </p>
          </div>
          <h3>
            {`Recipe Results are based off selling ${
              selectedRecipe.expectedSales
            } serves per week at
            $${selectedRecipe.salePricePerServe}`}
          </h3>
          <div className="resultsData">
            <ul className="recipeProfits">
              <li className="resultsHeaderIcon">
                <img
                  src={graphIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p>Recipe Mark up</p>
                <p>
                  {recipeResults.stats.markup
                    ? `${roundNumber(recipeResults.stats.markup)}%`
                    : '-'}
                </p>
              </li>
              <li>
                <p>Recipe Revenue</p>
                <p>
                  {recipeResults.stats.markup
                    ? `$${roundNumber(
                        recipeResults.stats.recipeRevenue
                      )}`
                    : '-'}
                </p>
              </li>
              <li>
                <p>Sale Price</p>
                <p>
                  {recipeResults.stats.markup
                    ? `$${roundNumber(
                        recipeResults.stats.recipeRevenue /
                          selectedRecipe.serves
                      )}`
                    : '-'}
                </p>
              </li>
              <ul>
                <li>
                  <p className="resultSectionTitle">Gross</p>
                </li>
                <li>
                  <p>Profit Per Serve</p>
                  <p>
                    {recipeResults.stats.markup
                      ? `$${roundNumber(
                          recipeResults.stats.grossProfitPerServe
                        )}`
                      : '-'}
                  </p>
                </li>

                <li>
                  <p>Profit Margin</p>
                  <p>
                    {recipeResults.stats.markup
                      ? `$${roundNumber(
                          recipeResults.stats.grossProfitMargin
                        )}`
                      : '-'}
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p className="resultSectionTitle">Net</p>
                </li>
                <li>
                  <p>Profit Per Serve</p>
                  <p>
                    {recipeResults.stats.markup
                      ? `$${roundNumber(
                          recipeResults.stats.netProfitPerServe
                        )}`
                      : '-'}
                  </p>
                </li>

                <li>
                  <p>Profit Margin</p>
                  <p>
                    {recipeResults.stats.markup
                      ? `$${roundNumber(
                          recipeResults.stats.netProfitMargin
                        )}`
                      : '-'}
                  </p>
                </li>
              </ul>

              <ul>
                <li>
                  <p>Recipe Grams</p>
                  <p>
                    {selectedRecipe.totalGrams
                      ? `${roundNumber(selectedRecipe.totalGrams)}g`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Grams Per Serve</p>
                  <p>
                    {selectedRecipe.totalGrams
                      ? `${roundNumber(
                          selectedRecipe.totalGrams /
                            selectedRecipe.serves
                        )}g`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Recipe Time</p>
                  <p>
                    {selectedRecipe.totalTime
                      ? `${roundNumber(selectedRecipe.totalTime)} sec`
                      : '0.00 min'}
                  </p>
                </li>
              </ul>
            </ul>
            <ul className="recipeCosts">
              <li className="resultsHeaderIcon">
                <img
                  src={moneyIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p>Cost Of Goods Sold</p>
                <p>
                  {recipeResults.ingredientCost &&
                    `$${roundNumber(recipeResults.ingredientCost)}`}
                </p>
              </li>
              <li>
                <p>Total Recipe Cost</p>
                <p>
                  {recipeResults.recipeCost &&
                    `$${roundNumber(recipeResults.recipeCost)}`}
                </p>
              </li>
              <li>
                <p>Cost Per Serve</p>
                <p>
                  {recipeResults.stats.markup
                    ? `$${roundNumber(
                        recipeResults.recipeCost /
                          selectedRecipe.serves
                      )}`
                    : '-'}
                </p>
              </li>

              <ul>
                <li>
                  <p>Ingredient Cost</p>
                  <p>
                    {recipeResults.ingredientCost &&
                      `$${roundNumber(recipeResults.ingredientCost)}`}
                  </p>
                </li>
                <li>
                  <p>Staff Cost</p>
                  <p>
                    {recipeResults.staffCost &&
                      `$${roundNumber(recipeResults.staffCost)}`}
                  </p>
                </li>
                <li>
                  <p>Venue Cost</p>
                  <p>
                    {recipeResults.venueCosts.venueCost &&
                      `$${roundNumber(
                        recipeResults.venueCosts.venueCost
                      )}`}
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>Rent Cost</p>
                  <p>
                    {recipeResults.venueCosts.rentCost &&
                      `$${roundNumber(
                        recipeResults.venueCosts.rentCost
                      )}`}
                  </p>
                </li>
                <li>
                  <p>Power Cost</p>
                  <p>
                    {recipeResults.venueCosts.powerCost
                      ? `$${roundNumber(
                          recipeResults.venueCosts.powerCost
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Water Cost</p>
                  <p>
                    {recipeResults.venueCosts.waterCost
                      ? `$${roundNumber(
                          recipeResults.venueCosts.waterCost
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Insurance Cost</p>
                  <p>
                    {recipeResults.venueCosts.insuranceCost
                      ? `$${roundNumber(
                          recipeResults.venueCosts.insuranceCost
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Council Cost</p>
                  <p>
                    {recipeResults.venueCosts.councilCost
                      ? `$${roundNumber(
                          recipeResults.venueCosts.councilCost
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Wastage Cost</p>
                  <p>
                    {recipeResults.venueCosts.wastageCost
                      ? `$${roundNumber(
                          recipeResults.venueCosts.wastageCost
                        )}`
                      : '-'}
                  </p>
                </li>
              </ul>
            </ul>
            <ul className="recipeProjections">
              <li className="resultsHeaderIcon">
                <img
                  src={carrotBlackIcon}
                  alt="Graph icon to represent the recipe profits"
                />
              </li>
              <li>
                <p className="resultSectionTitle">Gross</p>
              </li>
              <li>
                <p>Profit Per Week</p>
                <p>
                  {recipeResults.stats.grossProfitPerWeek
                    ? `$${roundNumber(
                        recipeResults.stats.grossProfitPerWeek
                      )}`
                    : '-'}
                </p>
              </li>
              <li>
                <p>Profit Per Month</p>
                <p>
                  {recipeResults.stats.grossProfitPerMonth
                    ? `$${roundNumber(
                        recipeResults.stats.grossProfitPerMonth
                      )}`
                    : '-'}
                </p>
              </li>
              <li>
                <p>Profit Per Year</p>
                <p>
                  {recipeResults.stats.grossProfitPerYear
                    ? `$${roundNumber(
                        recipeResults.stats.grossProfitPerYear
                      )}`
                    : '-'}
                </p>
              </li>
              <ul>
                <li>
                  <p className="resultSectionTitle">Net</p>
                </li>
                <li>
                  <p>Revenue Per Week</p>
                  <p>
                    {recipeResults.stats.netProfitPerWeek
                      ? `$${roundNumber(
                          recipeResults.stats.netProfitPerWeek
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Revenue Per Month</p>
                  <p>
                    {recipeResults.stats.netProfitPerMonth
                      ? `$${roundNumber(
                          recipeResults.stats.netProfitPerMonth
                        )}`
                      : '-'}
                  </p>
                </li>
                <li>
                  <p>Revenue Per Year</p>
                  <p>
                    {recipeResults.stats.netProfitPerYear
                      ? `$${roundNumber(
                          recipeResults.stats.netProfitPerYear
                        )}`
                      : '-'}
                  </p>
                </li>
              </ul>
            </ul>
          </div>
        </section>
      </AccordionBoxWithOpenHeader>
    );
  }
}

// RecipeResults.propTypes = {
// selectedRecipe: PropTypes.object.isRequired,
// selectedVenue: PropTypes.object.isRequired,
// ingredients: PropTypes.object.isRequired,
// profile: PropTypes.object.isRequired,
// updateReduxSelectedRecipe: PropTypes.func.isRequired
// };

const actions = {
  updateReduxSelectedRecipe
};

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe,
  selectedVenue: state.venues.selectedVenue,
  ingredients: state.ingredient.ingredients,
  profile: state.profile.profile
});

export default connect(
  mapState,
  actions
)(RecipeResults);
