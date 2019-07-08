import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SupplierForm from '../supplier/SupplierForm';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
// import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';

class IngredientForm extends Component {
  render() {
    const {
      errors,
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.props;
    const readyToSaveClass = readyToSave ? 'readyToSave' : '';

    let ingredientForm;
    if (
      isEmpty(selectedIngredient.metrics.cup) &&
      isEmpty(selectedIngredient.metrics.whole)
    ) {
      ingredientForm = (
        <Fragment>
          <h2>Add Ingredient Unit Weight Metric *</h2>
          <p>
            For every new ingredient we need to know it’s relevant
            unit metric weight
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
        <SupplierForm
          selectedSupplier={selectedSupplier}
          handleSupplierChange={this.props.handleSupplierChange}
          handleSupplierNumberChange={
            this.props.handleSupplierNumberChange
          }
          getSelectedValue={this.props.getSelectedSupplier}
          toggleChange={this.props.handleToggleChange}
        />
        {ingredientForm && ingredientForm}
        <div className="button">
          <nav
            className={readyToSaveClass}
            onClick={this.props.handleSubmit}
          >
            Save Ingredient
          </nav>
        </div>
      </section>
    );
  }
}

IngredientForm.propTypes = {
  ingredient: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  updateSelectedSupplierState: PropTypes.func.isRequired,
  getSelectedSupplier: PropTypes.func.isRequired,
  setPreferredSupplier: PropTypes.func.isRequired,
  updatePreferredSupplier: PropTypes.func.isRequired
};

const actions = {};

const mapState = state => ({
  errors: state.errors,
  ingredient: state.ingredient,
  supplier: state.supplier
});

export default connect(
  mapState,
  actions
)(IngredientForm);
