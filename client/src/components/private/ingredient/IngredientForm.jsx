import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import Spinner from '../../layout/Spinner';

class IngredientForm extends Component {
  // state = {
  //   // Whole: '',
  //   // cup: '',
  //   // preferred: '',
  //   selectedSupplierID: ''
  // };

  render() {
    const { selectedIngredient, errors } = this.props;

    // console.log(cup);

    return (
      <section className="ingredientForm">
        <h2>Add Ingredient Unit Weight Metric *</h2>
        <p>
          For every new ingredient we need to know it’s relevant unit
          metric weight
        </p>
        <form onSubmit={this.handleOnSubmit}>
          <TextInputHorizontal
            label="Cup"
            placeholder="Cup metric weight in grams"
            value={selectedIngredient.cup}
            name="cup"
            onChange={this.props.handleIngredientNumberChange}
            error={errors.cup && errors.cup}
          />
          <TextInputHorizontal
            label="Whole"
            placeholder="Whole weight in grams"
            value={selectedIngredient.whole}
            name="whole"
            onChange={this.props.handleIngredientNumberChange}
            error={errors && errors.Whole}
          />
        </form>
      </section>
    );
  }
}

IngredientForm.propTypes = {
  selectedIngredient: PropTypes.object.isRequired,
  handleIngredientNumberChange: PropTypes.func.isRequired
};

const actions = {};

const mapState = state => ({
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(IngredientForm);
