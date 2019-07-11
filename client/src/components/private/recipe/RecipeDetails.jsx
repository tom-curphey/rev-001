import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectRecipe from './SelectRecipe';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';

class RecipeDetails extends Component {
  state = {
    serves: '',
    pricePerServe: '',
    expectedWeeklyServesSales: ''
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { recipe, errors } = this.props;
    const {
      serves,
      pricePerServe,
      expectedWeeklyServesSales
    } = this.state;

    return (
      <section className="recipeDetails">
        <div className="recipeDetailsHeader">
          <div>
            <div className="selectRecipe">
              <SelectRecipe />
            </div>
          </div>
          <div>
            <form onSubmit={this.handleOnSubmit}>
              <TextInputHorizontal
                label="Recipe Serves"
                value={serves}
                name="serves"
                onChange={this.handleChange}
                type="text"
                error={errors.serves && errors.serves}
                labelClass="alignTitleRight"
              />
              <TextInputHorizontal
                label="Sale price per serve"
                value={pricePerServe}
                name="pricePerServe"
                onChange={this.handleChange}
                type="text"
                error={errors.pricePerServe && errors.pricePerServe}
                labelClass="alignTitleRight"
              />
              <TextInputHorizontal
                label="Expected Weekly Serve Sales"
                value={expectedWeeklyServesSales}
                name="expectedWeeklyServesSales"
                onChange={this.handleChange}
                type="text"
                error={
                  errors.expectedWeeklyServesSales &&
                  errors.expectedWeeklyServesSales
                }
                labelClass="alignTitleRight"
              />
            </form>
          </div>
        </div>
      </section>
    );
  }
}

RecipeDetails.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

export default connect(mapState)(RecipeDetails);
