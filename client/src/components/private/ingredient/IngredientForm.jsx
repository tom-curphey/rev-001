import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SupplierForm from '../supplier/SupplierForm';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
// import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';

const IngredientForm = ({ errors, selectedIngredient }) => {
  let ingredientForm;
  if (
    isEmpty(selectedIngredient.metrics.cup) &&
    isEmpty(selectedIngredient.metrics.whole)
  ) {
    ingredientForm = (
      <Fragment>
        <h2>Add Ingredient Unit Weight Metric *</h2>
        <p>
          For every new ingredient we need to know it’s relevant unit
          metric weight
        </p>
        <form onSubmit={this.handleOnSubmit}>
          <TextInputHorizontal
            label="Cup"
            placeholder="Cup metric weight in grams"
            value={selectedIngredient.metrics.cup}
            name="cup"
            onChange={this.props.handleIngredientNumberChange}
            error={errors.cup && errors.cup}
          />
          <TextInputHorizontal
            label="Whole"
            placeholder="Whole weight in grams"
            value={selectedIngredient.metrics.whole}
            name="whole"
            onChange={this.handleIngredientNumberChange}
            error={errors && errors.Whole}
          />
        </form>
      </Fragment>
    );
  }

  return (
    <section className="ingredientForm">
      {ingredientForm && ingredientForm}
    </section>
  );
};

IngredientForm.propTypes = {
  errors: PropTypes.object.isRequired
};

const mapState = state => ({
  errors: state.errors
});

export default connect(mapState)(IngredientForm);
