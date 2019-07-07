import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredientAndSupplier
} from './ingredientActions';
import {
  loadSuppliers,
  setSelectedSupplier,
  removeSelectedSupplier
} from '../supplier/supplierActions';
import SelectIngredient from './SelectIngredient';
import SupplierForm from '../supplier/SupplierForm';
import IngredientForm from './IngredientForm';
import SupplierPanel from '../supplier/SupplierPanel';
import { isEmpty } from '../../../utils/utils';

const Ingredient = ({
  ingredient,
  loadIngredients,
  loadSuppliers
}) => {
  useEffect(() => {
    loadIngredients();
    loadSuppliers();
  }, []);

  let ingredientForm;
  let supplierPanel;
  if (ingredient && ingredient.loading) {
    ingredientForm = (
      <div style={{ marginTop: '200px' }}>
        <Spinner width="30px" />
      </div>
    );
  } else {
    if (ingredient.selectedIngredient) {
      ingredientForm = (
        <Fragment>
          <SelectIngredient />
          {ingredient.selectedIngredient && <IngredientForm />}
        </Fragment>
      );

      supplierPanel = (
        <Fragment>
          {ingredient.selectedIngredient && <SupplierPanel />}
        </Fragment>
      );
    } else {
      ingredientForm = <SelectIngredient />;
    }
  }

  return (
    <AuthMenu>
      <section className="ingredient">
        <div>
          <h1>Ingredients</h1>
          <h3>Search / Create / Edit</h3>
          {ingredientForm}
        </div>
        <div>{supplierPanel}</div>
      </section>
    </AuthMenu>
  );
};

const actions = {
  loadIngredients,
  loadSuppliers
};

const mapState = state => ({
  ingredient: state.ingredient,
  supplier: state.supplier,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(Ingredient);
