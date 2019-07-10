import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';

const IngredientForm = ({
  errors,
  selectedIngredient,
  handleIngredientNumberChange
}) => {
  return (
    <section className="ingredientForm">
      <Fragment>
        <h2>Add New Ingredient Metric Weight</h2>
        <p>
          For every new ingredient we need to know it’s relevant unit
          metric weight
        </p>
        <form>
          <TextInputHorizontal
            label="Cup"
            placeholder="Cup metric weight in grams"
            value={selectedIngredient.metrics.cup}
            name="cup"
            onChange={handleIngredientNumberChange}
            error={errors.cup && errors.cup}
          />
          <TextInputHorizontal
            label="Whole"
            placeholder="Whole weight in grams"
            value={selectedIngredient.metrics.whole}
            name="whole"
            onChange={handleIngredientNumberChange}
            error={errors && errors.Whole}
          />
        </form>
      </Fragment>
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
