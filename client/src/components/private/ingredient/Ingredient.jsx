import React, { Component, Fragment } from 'react';
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
import IngredientForm from '../ingredient/IngredientForm';
import { isEmpty } from '../../../utils/utils';

class Ingredient extends Component {
  state = {
    addIngredientForm: false,
    selectedIngredient: null,
    selectedSupplier: {
      _id: '',
      displayName: '',
      packetCost: '',
      packetGrams: '',
      preferred: false
    },
    readyToSave: false
  };

  componentDidMount() {
    // console.log('I RAN');
    this.props.loadIngredients();
    this.props.loadSuppliers();
    if (this.props.ingredient.selectedIngredient) {
      this.changeSelectedIngredient(
        this.props.ingredient.selectedIngredient
      );
    }
    if (this.props.supplier.selectedSupplier) {
      const {
        _id,
        displayName
      } = this.props.supplier.selectedSupplier;
      this.setState(prevState => ({
        selectedSupplier: {
          ...prevState.selectedSupplier,
          _id: _id,
          displayName: displayName
        }
      }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.ingredient.selectedIngredient !==
      this.props.ingredient.selectedIngredient
    ) {
      const { selectedIngredient } = this.props.ingredient;
      this.changeSelectedIngredient(
        this.props.ingredient.selectedIngredient
      );
    }
    if (
      this.props.supplier.selectedSupplier &&
      prevProps.supplier.selectedSupplier !==
        this.props.supplier.selectedSupplier
    ) {
      console.log('in func');

      const {
        _id,
        displayName,
        packetCost,
        packetGrams,
        preferred
      } = this.props.supplier.selectedSupplier;
      this.setState(prevState => ({
        selectedSupplier: {
          // ...prevState.selectedSupplier,
          _id: _id,
          displayName: displayName,
          packetCost: packetCost,
          packetGrams: packetGrams,
          preferred: preferred
        }
      }));
      this.checkReadyToSave();
    }
    if (
      prevState.selectedSupplier !== this.state.selectedSupplier ||
      prevState.selectedIngredient !== this.state.selectedIngredient
    ) {
      console.log('state check');

      this.checkReadyToSave();
    }
  }

  handleSupplierChange = e => {
    e.persist();
    let value = e.target.value;
    this.setState(prevState => ({
      selectedSupplier: {
        ...prevState.selectedSupplier,
        [e.target.name]: value
      }
    }));
    // this.checkReadyToSave(e);
  };

  handleSupplierNumberChange = e => {
    e.persist();
    let value = e.target.value;
    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        selectedSupplier: {
          ...prevState.selectedSupplier,
          [e.target.name]: value
        }
      }));
      // this.checkReadyToSave(e);
    }
  };

  getSelectedSupplier = selectedValue => {
    // let addIngredient = false;
    let selectedSupplier = [];
    if (selectedValue.__isNew__) {
      this.props.removeSelectedSupplier();
      // addSupplier = true;
      const newSupplier = {};
      newSupplier.displayName = selectedValue.label;
      // newSupplier.new = true;
      newSupplier.phone = '';
      newSupplier.email = '';
      newSupplier.address = '';
      newSupplier.website = '';
      selectedSupplier.push(newSupplier);
    } else {
      selectedSupplier = this.props.supplier.suppliers.filter(
        Supplier => {
          return Supplier._id === selectedValue.value;
        }
      );
    }

    this.props.setSelectedSupplier(selectedSupplier[0]);
  };

  handleIngredientNumberChange = e => {
    e.persist();
    let value = e.target.value;
    if (!isNaN(value) || value === '') {
      this.setState(prevState => ({
        selectedIngredient: {
          ...prevState.selectedIngredient,
          metrics: {
            ...prevState.selectedIngredient.metrics,
            [e.target.name]: value
          }
        }
      }));
      // this.checkReadyToSave(e);
    }
  };

  changeSelectedIngredient = selectedIngredient => {
    this.setState({
      selectedIngredient: selectedIngredient,
      readyToSave: false
    });
    if (
      !isEmpty(selectedIngredient._id) &&
      selectedIngredient.suppliers.length !== 0
    ) {
      this.updateSelectedSupplier(selectedIngredient);
    }
  };

  updateSelectedSupplier = selectedIngredient => {
    const selectedSupplier = selectedIngredient.suppliers.filter(
      sSupplier => {
        return sSupplier.preferred;
      }
    );

    console.log('selectedSupplier', selectedSupplier);

    if (selectedSupplier.length !== 0) {
      this.props.setSelectedSupplier(selectedSupplier[0]);
    }
  };

  handleToggleChange = e => {
    if (e.target.name && e.target.name === 'preferred') {
      console.log('clicked', e.target);
      this.setState(prevState => ({
        selectedSupplier: {
          ...prevState.selectedSupplier,
          preferred: !this.state.selectedSupplier.preferred
        }
      }));
    }
  };

  checkReadyToSave = () => {
    const {
      selectedIngredient: { metrics, displayName },
      selectedSupplier: { _id, packetCost, packetGrams }
    } = this.state;

    if (
      (!isEmpty(metrics.cup) || !isEmpty(metrics.whole)) &&
      !isEmpty(_id) &&
      !isEmpty(packetCost) &&
      !isEmpty(packetGrams)
    ) {
      this.setState({ readyToSave: true });
    }
  };

  handleSubmit = () => {
    // console.log('STATE:', this.state);
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.state;

    if (readyToSave) {
      const ingredientData = {};
      ingredientData.metrics = {};

      if (selectedIngredient._id) {
        console.log('Edit ingredient');
        ingredientData._id = selectedIngredient._id;
        ingredientData.displayName = selectedIngredient.displayName;
        if (!isEmpty(selectedIngredient.metrics.cup))
          ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        if (!isEmpty(selectedIngredient.metrics.whole))
          ingredientData.metrics.whole =
            selectedIngredient.metrics.whole;
      } else {
        console.log('Add new ingredient');
        ingredientData.displayName = selectedIngredient.displayName;
        if (!isEmpty(selectedIngredient.metrics.cup))
          ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        if (!isEmpty(selectedIngredient.metrics.whole))
          ingredientData.metrics.whole =
            selectedIngredient.metrics.whole;
      }

      const supplierData = {};
      supplierData._id = selectedSupplier._id;
      supplierData.preferred = selectedSupplier.preferred;
      supplierData.packetGrams = selectedSupplier.packetGrams;
      supplierData.packetCost = selectedSupplier.packetCost;
      console.log('supplierData', supplierData);

      this.props.addOrEditIngredientAndSupplier(
        ingredientData,
        supplierData
      );
    }
  };

  render() {
    const { ingredient } = this.props;
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.state;

    const readyToSaveClass = readyToSave ? 'readyToSave' : '';

    let ingredientForm;
    if (ingredient && ingredient.loading) {
      ingredientForm = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (selectedIngredient !== null) {
        ingredientForm = (
          <Fragment>
            <SelectIngredient
              getSelectedIngredient={this.getSelectedIngredient}
            />
            {selectedIngredient && selectedIngredient !== null && (
              <SupplierForm
                selectedSupplier={selectedSupplier}
                handleSupplierChange={this.handleSupplierChange}
                handleSupplierNumberChange={
                  this.handleSupplierNumberChange
                }
                getSelectedValue={this.getSelectedSupplier}
                toggleChange={this.handleToggleChange}
              />
            )}
            {selectedIngredient &&
              selectedIngredient !== null &&
              !selectedIngredient._id && (
                <IngredientForm
                  selectedIngredient={selectedIngredient}
                  handleIngredientNumberChange={
                    this.handleIngredientNumberChange
                  }
                />
              )}
            {selectedIngredient && (
              <div className="button">
                <nav
                  className={readyToSaveClass}
                  onClick={this.handleSubmit}
                >
                  Save Ingredient
                </nav>
              </div>
            )}
          </Fragment>
        );
      } else {
        // console.log('HERE');

        ingredientForm = (
          <SelectIngredient
            getSelectedIngredient={this.getSelectedIngredient}
          />
        );
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
          <div>Panel</div>
        </section>
      </AuthMenu>
    );
  }
}

Ingredient.propTypes = {
  ingredient: PropTypes.object,
  profile: PropTypes.object,
  loadIngredients: PropTypes.func.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  addOrEditIngredientAndSupplier: PropTypes.func.isRequired,
  loadSuppliers: PropTypes.func.isRequired,
  setSelectedSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredientAndSupplier,
  loadSuppliers,
  setSelectedSupplier,
  removeSelectedSupplier
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
