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
import {
  isEmpty,
  formatSelectedSupplierInput
} from '../../../utils/utils';

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
      prevProps.profile.profile !== this.props.profile.profile &&
      this.props.ingredient.selectedIngredient !== null
    ) {
      console.log('check');

      // console.log(this.props.ingredient.selectedIngredient);

      this.changeSelectedIngredient(
        this.props.ingredient.selectedIngredient
      );
    }

    if (
      prevProps.ingredient.selectedIngredient !==
      this.props.ingredient.selectedIngredient
    ) {
      console.log('Here', this.props.ingredient.selectedIngredient);

      this.changeSelectedIngredient(
        this.props.ingredient.selectedIngredient
      );
    }
    if (
      this.props.supplier.selectedSupplier &&
      prevProps.supplier.selectedSupplier !==
        this.props.supplier.selectedSupplier
    ) {
      console.log(
        'in update func',
        this.props.supplier.selectedSupplier
      );

      // const {
      //   supplier: { _id, displayName },
      //   packetCost,
      //   packetGrams,
      //   preferred
      // } = this.props.supplier.selectedSupplier;
      // this.setState(prevState => ({
      //   selectedSupplier: {
      //     // ...prevState.selectedSupplier,
      //     _id: _id,
      //     displayName: displayName,
      //     packetCost: packetCost,
      //     packetGrams: packetGrams,
      //     preferred: preferred
      //   }
      // }));
      this.checkReadyToSave();
    }
    if (
      prevState.selectedSupplier !== this.state.selectedSupplier ||
      prevState.selectedIngredient !== this.state.selectedIngredient
    ) {
      // console.log('state check');

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

    console.log('Value', value);

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

  getSelectedSupplierOnSupplierChange = selectedValue => {
    console.log('selectedValue', selectedValue);

    let selectedSupplier = [];
    if (selectedValue.__isNew__) {
      // // addSupplier = true;
      // const newSupplier = {};
      // newSupplier.supplier = {};
      // newSupplier.supplier.displayName = selectedValue.label;
      // // newSupplier.new = true;
      // newSupplier.phone = '';
      // newSupplier.email = '';
      // newSupplier.address = '';
      // newSupplier.website = '';
      // selectedSupplier.push(newSupplier);
    } else {
      // Find selected supplier in suppliers list
      const selectedSupplierFromList = this.props.supplier.suppliers.filter(
        Supplier => {
          return Supplier._id === selectedValue.value;
        }
      );

      // Check if supplier was found
      if (selectedSupplierFromList.length !== 0) {
        const { selectedIngredient } = this.state;
        // Check if selected ingredient has suppliers
        if (selectedIngredient.suppliers !== 0) {
          // Search for selected supplier in selected ingredient suppier list
          const selectedIngredientSupplier = selectedIngredient.suppliers.filter(
            siSupplier => {
              return (
                siSupplier.supplier._id ===
                selectedSupplierFromList[0]._id
              );
            }
          );
          if (selectedIngredientSupplier.length !== 0) {
            console.log(
              'selectedIngredientSupplier',
              selectedIngredientSupplier
            );
            this.setState({
              selectedSupplier: selectedIngredientSupplier[0]
            });
          } else {
            console.log(
              'Selected supplier was not in selected ingredient suppliers list'
            );
          }
        } else {
          console.log(
            'Selected ingredient does not have any suppliers'
          );
        }
      } else {
        console.log('New supplier entered');
      }
    }
  };

  // On ingredient change update selected supplier
  // Triggers in ingredient change
  updateSelectedSuppliersOnIngredientChange = selectedIngredient => {
    const { profile } = this.props.profile;

    console.log('PROFILE', profile);

    // // Check if profile has ingredients
    if (profile.ingredients.length !== 0) {
      // Filter profile ingredients to get selected ingredient from profile ingredients
      const pIngredient = this.props.profile.profile.ingredients.filter(
        pi => {
          return pi.ingredient === selectedIngredient._id;
        }
      );

      // Check if profile has selected ingredient
      if (pIngredient.length !== 0) {
        console.log('pIngredient---', pIngredient);

        // Check if profile ingredient has suppliers
        if (pIngredient[0].suppliers.length !== 0) {
          let preferredSupplier = {
            _id: '',
            displayName: '',
            packetCost: '',
            packetGrams: '',
            preferred: false
          };
          const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
            usiSuppiler => {
              const piSupplier = pIngredient[0].suppliers.filter(
                pis => {
                  return pis.supplier === usiSuppiler.supplier._id;
                }
              );

              if (piSupplier.length !== 0) {
                usiSuppiler.profilePacketCost =
                  piSupplier[0].packetCost;
                usiSuppiler.profilePacketGrams =
                  piSupplier[0].packetGrams;
                usiSuppiler.preferred = piSupplier[0].preferred;

                if (usiSuppiler.preferred) {
                  preferredSupplier = usiSuppiler;
                }
              } else {
                usiSuppiler.preferred = false;
              }

              return usiSuppiler;
            }
          );

          const updatedSelectedIngredient = {
            ...selectedIngredient,
            suppliers: updatedSelectedIngredientSuppliers
          };

          this.setState({
            selectedIngredient: updatedSelectedIngredient,
            selectedSupplier: preferredSupplier
          });
        } else {
          console.log('Profile ingredient has not suppliers');
        }
      } else {
        console.log('Profile does not have the selected ingredient');
      }
    } else {
      console.log('Profile has no ingredients');
    }

    const selectedSupplier = selectedIngredient.suppliers.filter(
      sSupplier => {
        return sSupplier.preferred;
      }
    );

    if (selectedSupplier.length !== 0) {
      // const formattedSupplier = formatSelectedSupplierInput(
      //   selectedSupplier[0],
      //   this.props.profile.profile,
      //   selectedIngredient
      // );
      // this.props.setSelectedSupplier(formattedSupplier);
    }
  };

  changeSelectedIngredient = selectedIngredient => {
    if (
      !isEmpty(selectedIngredient._id) &&
      selectedIngredient.suppliers.length !== 0
    ) {
      this.updateSelectedSuppliersOnIngredientChange(
        selectedIngredient
      );
    } else {
      // Probably have to set the preferred supplier to false..

      this.setState({
        selectedIngredient: selectedIngredient,
        readyToSave: false
      });
    }
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

      const {
        supplier: { _id },
        preferred,
        profilePacketGrams,
        profilePacketCost,
        packetCost,
        packetGrams
      } = selectedSupplier;

      const supplierData = {};
      supplierData._id = _id;
      supplierData.preferred = preferred;
      supplierData.packetGrams = profilePacketGrams
        ? profilePacketGrams
        : packetGrams;
      supplierData.packetCost = profilePacketCost
        ? profilePacketCost
        : packetCost;
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
            // getSelectedIngredient={this.getSelectedIngredient}
            />
            {selectedIngredient && selectedIngredient !== null && (
              <SupplierForm
                selectedSupplier={selectedSupplier}
                handleSupplierChange={this.handleSupplierChange}
                handleSupplierNumberChange={
                  this.handleSupplierNumberChange
                }
                getSelectedValue={
                  this.getSelectedSupplierOnSupplierChange
                }
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
          // getSelectedIngredient={this.getSelectedIngredient}
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
  removeSelectedSupplier: PropTypes.func.isRequired,
  formatSelectedSupplierInput: PropTypes.func
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
