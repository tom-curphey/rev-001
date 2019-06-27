import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredient
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
      preferred: ''
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
      prevProps.supplier.selectedSupplier !==
      this.props.supplier.selectedSupplier
    ) {
      console.log('in func');

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
      this.checkReadyToSave();
    }
    if (prevState.selectedSupplier !== this.state.selectedSupplier) {
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
    this.checkReadyToSave(e);
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
      this.checkReadyToSave(e);
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
      newSupplier.new = true;
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

    this.props.setSelectedSupplier(
      selectedSupplier[0],
      this.props.profile.profile,
      true
    );
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
      this.checkReadyToSave(e);
    }
  };

  changeSelectedIngredient = selectedIngredient => {
    if (isEmpty(selectedIngredient._id)) {
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient,
        selectedSupplier: {
          _id: '',
          displayName: '',
          packetCost: '',
          packetGrams: '',
          preferred: ''
        },
        readyToSave: false
      });
    } else {
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient,
        readyToSave: false
      });
    }
  };

  checkReadyToSave = () => {
    const {
      selectedIngredient: { metrics },
      selectedSupplier: { _id, packetCost, packetGrams }
    } = this.state;

    console.group('in Check');
    console.log('cup', metrics.cup);
    console.log('whole', metrics.whole);
    console.log('id', _id);
    console.log('packetCost', packetCost);
    console.log('packetGrams', packetGrams);
    console.groupEnd();

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
      const supplierData = {};
      if (selectedIngredient._id) {
        console.log('Edit ingredient');
        ingredientData._id = selectedIngredient._id;
        ingredientData.displayName = selectedIngredient.displayName;
        if (!isEmpty(selectedIngredient.metrics.cup))
          ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        if (!isEmpty(selectedIngredient.metrics.whole))
          ingredientData.metrics.whole =
            selectedIngredient.metrics.whole;

        supplierData._id = selectedSupplier._id;
        supplierData.packetGrams = selectedSupplier.packetGrams;
        supplierData.packetCost = selectedSupplier.packetCost;
        console.log('supplierData', supplierData);
      } else {
        console.log('Add new ingredient');
        ingredientData.displayName = selectedIngredient.displayName;
        if (!isEmpty(selectedIngredient.metrics.cup))
          ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        if (!isEmpty(selectedIngredient.metrics.whole))
          ingredientData.metrics.whole =
            selectedIngredient.metrics.whole;

        supplierData._id = selectedSupplier._id;
        supplierData.packetGrams = selectedSupplier.packetGrams;
        supplierData.packetCost = selectedSupplier.packetCost;
        console.log('supplierData', supplierData);
      }

      this.props.addOrEditIngredient(ingredientData, supplierData);
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
              />
            )}
            {selectedIngredient &&
              selectedIngredient !== null &&
              selectedIngredient.new && (
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
  addOrEditIngredient: PropTypes.func.isRequired,
  loadSuppliers: PropTypes.func.isRequired,
  setSelectedSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredient,
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
