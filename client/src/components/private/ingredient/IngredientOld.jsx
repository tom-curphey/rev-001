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
import IngredientForm from './IngredientForm';
import SupplierPanel from '../supplier/SupplierPanel';
import { isEmpty } from '../../../utils/utils';

class Ingredient extends Component {
  state = {
    addIngredientForm: false,
    selectedIngredient: null,
    selectedSupplier: {
      supplier: {
        _id: '',
        displayName: ''
      },
      packetCost: '',
      packetGrams: '',
      profilePacketCost: null,
      profilePacketGrams: null,
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
      // this.changeSelectedIngredient(
      //   this.props.ingredient.selectedIngredient
      // );
    }

    if (
      prevProps.ingredient.selectedIngredient !==
      this.props.ingredient.selectedIngredient
    ) {
      // console.log(
      //   'SELECTED INGREDIENT CHANGE',
      //   this.props.ingredient.selectedIngredient
      // );

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

      if (this.props.supplier.selectedSupplier.supplier) {
        const {
          supplier: { _id, displayName }
        } = this.props.supplier.selectedSupplier;

        this.setState(prevState => ({
          selectedSupplier: {
            ...prevState.selectedSupplier,
            supplier: {
              _id: _id,
              displayName: displayName
            }
          }
        }));
      } else {
        console.log('Selected Supplier.supplier was not set');
      }

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
    }
  };

  getSelectedSupplierOnSupplierChange = selectedValue => {
    console.log('selectedValue', selectedValue);

    if (selectedValue.__isNew__) {
      console.log('New supplier selected');
      const selectedSupplier = {
        supplier: {
          _id: '',
          displayName: selectedValue.label
        },
        packetCost: '',
        packetGrams: '',
        profilePacketCost: null,
        profilePacketGrams: null,
        preferred: false,
        phone: '',
        email: '',
        address: '',
        website: ''
      };
      this.props.setSelectedSupplier(selectedSupplier);
      this.setState({ selectedSupplier: selectedSupplier });
    } else {
      // Find selected supplier in suppliers list
      const selectedSupplierFromSupplierList = this.props.supplier.suppliers.filter(
        Supplier => {
          return Supplier._id === selectedValue.value;
        }
      );
      // Check if supplier was found
      if (selectedSupplierFromSupplierList.length !== 0) {
        const { selectedIngredient } = this.state;
        // Check if selected ingredient has suppliers
        if (selectedIngredient.suppliers.length !== 0) {
          // Search for selected supplier in selected ingredient suppier list
          const selectedIngredientSupplier = selectedIngredient.suppliers.filter(
            siSupplier => {
              return (
                siSupplier.supplier._id ===
                selectedSupplierFromSupplierList[0]._id
              );
            }
          );
          if (selectedIngredientSupplier.length !== 0) {
            const { profile } = this.props.profile;
            let selectedSupplier = {};
            // Check if profile has ingredients
            if (profile.ingredients.length !== 0) {
              // Check if ingredient has been updated in user profile
              const pIngredient = profile.ingredients.filter(
                sIngredient => {
                  return (
                    sIngredient.ingredient === selectedIngredient._id
                  );
                }
              );
              // Check if ingredient was found in profile
              if (pIngredient.length !== 0) {
                // Check if profile ingredient has suppliers
                if (pIngredient[0].suppliers.length !== 0) {
                  // Check if supplier is listed in profile ingredient
                  const piSupplier = pIngredient[0].suppliers.filter(
                    pis => {
                      return (
                        pis.supplier ===
                        selectedIngredientSupplier[0].supplier._id
                      );
                    }
                  );
                  // Check if profile ingredient supplier was found
                  if (piSupplier.length !== 0) {
                    selectedSupplier = {
                      ...selectedIngredientSupplier[0],
                      preferred: piSupplier[0].preferred,
                      profilePacketCost: piSupplier[0].packetCost,
                      profilePacketGrams: piSupplier[0].packetGrams
                    };
                  } else {
                    console.log(
                      'Supplier was not found profile ingredient suppliers list'
                    );
                  }
                } else {
                  console.log(
                    'Profile ingredient does not have suppliers'
                  );
                }
              } else {
                console.log(
                  'Ingredient was not found in profile ingredients'
                );
              }
            } else {
              console.log('Profile has no ingredients');
            }
            if (isEmpty(selectedSupplier)) {
              console.log(
                'selectedIngredientSupplier[0]',
                selectedIngredientSupplier[0]
              );

              selectedSupplier = {
                ...selectedIngredientSupplier[0],
                preferred: false,
                profilePacketCost:
                  selectedIngredientSupplier[0].packetCost,
                profilePacketGrams:
                  selectedIngredientSupplier[0].packetGrams
              };
            }

            this.setState({
              selectedSupplier: selectedSupplier
            });
          } else {
            console.log(
              'Selected supplier was not in selected ingredient suppliers list'
            );
            const selectedSupplier = {
              supplier: {
                _id: selectedSupplierFromSupplierList[0]._id,
                displayName:
                  selectedSupplierFromSupplierList[0].displayName
              },
              packetCost: '',
              packetGrams: '',
              profilePacketCost: null,
              profilePacketGrams: null,
              preferred: false
            };
            this.setState({ selectedSupplier: selectedSupplier });
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
        // Check if profile ingredient has suppliers
        if (pIngredient[0].suppliers.length !== 0) {
          const { selectedSupplier } = this.state;

          // console.log('SSI', this.state.selectedIngredient);
          // console.log('SI', selectedIngredient);

          let preferredSupplier = {};
          // If selected ingredient hasn't changed in local state set local state selected supplier as the preferred supplier
          // Otherwise set local selected supplier to an empty state
          if (
            this.state.selectedIngredient !== null &&
            this.state.selectedIngredient._id ===
              selectedIngredient._id
          ) {
            preferredSupplier = selectedSupplier;
          } else {
            preferredSupplier = {
              supplier: {
                _id: '',
                displayName: ''
              },
              packetCost: '',
              packetGrams: '',
              profilePacketCost: null,
              profilePacketGrams: null,
              preferred: false
            };
          }

          const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
            usiSuppiler => {
              const piSupplier = pIngredient[0].suppliers.filter(
                pis => {
                  return pis.supplier === usiSuppiler.supplier._id;
                }
              );

              if (piSupplier.length !== 0) {
                // console.log('MADE IT');
                // console.log('piSupplier', piSupplier);

                usiSuppiler.profilePacketCost =
                  piSupplier[0].packetCost;
                usiSuppiler.profilePacketGrams =
                  piSupplier[0].packetGrams;
                usiSuppiler.preferred = piSupplier[0].preferred;

                if (
                  isEmpty(preferredSupplier.supplier._id) &&
                  usiSuppiler.preferred
                ) {
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

          // console.log(
          //   'updatedSelectedIngredient',
          //   updatedSelectedIngredient
          // );

          this.setState({
            selectedIngredient: updatedSelectedIngredient,
            selectedSupplier: preferredSupplier
          });
        } else {
          console.log('Profile ingredient has not suppliers');
        }
      } else {
        console.log('Profile does not have the selected ingredient');

        this.setState(prevState => ({
          selectedIngredient: selectedIngredient,
          selectedSupplier: {
            ...prevState.selectedSupplier,
            supplier: {
              _id: '',
              displayName: ''
            },
            packetCost: selectedIngredient.packetCost,
            packetGrams: selectedIngredient.packetGrams,
            profilePacketCost: null,
            profilePacketGrams: null,
            preferred: false
          }
        }));
      }
    } else {
      console.log('Profile has no ingredients');
    }

    const selectedSupplier = selectedIngredient.suppliers.filter(
      sSupplier => {
        return sSupplier.preferred;
      }
    );
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

    console.log('Value', value);

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
    const { selectedSupplier, selectedIngredient } = this.state;

    if (selectedSupplier.preferred) {
      // Search through props to see if there was another preferred supplier prior
      let spSupplier;
      console.log('SISS', this.props.ingredient.selectedIngredient);

      if (
        this.props.ingredient.selectedIngredient.suppliers.length !==
        0
      ) {
        spSupplier = this.props.ingredient.selectedIngredient.suppliers.filter(
          sps => {
            return sps.preferred === true;
          }
        );

        if (
          spSupplier.length !== 0 &&
          selectedIngredient.suppliers.length !== 0
        ) {
          console.log('spSupplier', spSupplier);
          console.log('selectedSupplier', selectedSupplier);

          const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
            sis => {
              console.log('sis', sis);
              console.log('spSupplier', spSupplier[0]);

              if (sis.supplier._id === spSupplier[0].supplier._id) {
                sis.preferred = true;
              } else {
                // Set all state selected ingredients to false
                sis.preferred = false;
              }
              return sis;
            }
          );

          const updatedSelectedIngredient = {
            ...selectedIngredient,
            updatedSelectedIngredientSuppliers
          };

          this.setState(prevState => ({
            // selectedIngredient: updatedSelectedIngredient,
            selectedSupplier: {
              ...prevState.selectedSupplier,
              preferred: !this.state.selectedSupplier.preferred
            }
          }));
        } else {
          console.log(
            'State selected ingredient had no preferred supplier'
          );
        }
      } else {
        console.log(
          ' There are no props.selectedIngredient suppliers'
        );
      }

      // Current selected supplier is preferred & needs to be false
    } else {
      console.log('selectedIngredient', selectedIngredient);
      console.log(
        'props selectedIngredient',
        this.props.ingredient.selectedIngredient
      );
      console.log(
        'state selectedIngredient',
        this.state.selectedIngredient
      );

      // Set state selected supplier to preferred
      // Set all other ingredient suppliers to false in the state
      const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
        sis => {
          if (sis.supplier._id !== selectedSupplier._id) {
            // Set all state selected ingredients to false
            sis.preferred = false;
          }
          return sis;
        }
      );

      const updatedSelectedIngredient = {
        ...selectedIngredient,
        updatedSelectedIngredientSuppliers
      };

      console.log('State selectedSupplier', selectedSupplier);
      console.log(
        'State updatedSelectedIngredient',
        updatedSelectedIngredient
      );

      this.setState(prevState => ({
        selectedIngredient: updatedSelectedIngredient,
        selectedSupplier: {
          ...prevState.selectedSupplier,
          preferred: !this.state.selectedSupplier.preferred
        }
      }));
    }

    // this.setState(prevState => ({
    //   selectedSupplier: {
    //     ...prevState.selectedSupplier,
    //     preferred: !this.state.selectedSupplier.preferred
    //   }
    // }));
  };

  changeSelectedIngredientPreferredSupplier = cpSupplier => {
    const { selectedIngredient } = this.state;
    if (selectedIngredient.suppliers.length !== 0) {
      const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
        sis => {
          if (sis.supplier._id === cpSupplier.supplier._id) {
            sis.preferred = false;
          }
          return sis;
        }
      );

      const updatedSelectedIngredient = {
        ...selectedIngredient,
        updatedSelectedIngredientSuppliers
      };

      this.setState({
        selectedIngredient: updatedSelectedIngredient
      });
    }
  };

  checkSelectedIngredientPreferredSupplier = cpSupplier => {
    const { selectedIngredient } = this.state;
    if (selectedIngredient.suppliers.length !== 0) {
      const updatedSelectedIngredientSuppliers = selectedIngredient.suppliers.map(
        sis => {
          if (sis.supplier._id === cpSupplier.supplier._id) {
            sis.preferred = true;
          }
          return sis;
        }
      );

      const updatedSelectedIngredient = {
        ...selectedIngredient,
        updatedSelectedIngredientSuppliers
      };

      this.setState({
        selectedIngredient: updatedSelectedIngredient
      });
    }
  };

  checkReadyToSave = () => {
    const {
      selectedIngredient: { metrics, displayName },
      selectedSupplier: {
        supplier,
        packetCost,
        packetGrams,
        profilePacketCost,
        profilePacketGrams
      }
    } = this.state;

    // console.log('RTS: selectedSupplier', this.state.selectedSupplier);

    if (
      (!isEmpty(metrics.cup) || !isEmpty(metrics.whole)) &&
      !isEmpty(supplier._id) &&
      // !isEmpty(packetCost) &&
      // !isEmpty(packetGrams) &&
      !isEmpty(profilePacketCost) &&
      !isEmpty(profilePacketGrams)
    ) {
      this.setState({ readyToSave: true });
    } else {
      this.setState({ readyToSave: false });
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
      // console.log('supplierData', supplierData);

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
    let supplierPanel;
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

        supplierPanel = (
          <SupplierPanel
            selectedIngredient={selectedIngredient}
            selectedSupplier={selectedSupplier}
            changeSelectedIngredientPreferredSupplier={
              this.changeSelectedIngredientPreferredSupplier
            }
            checkSelectedIngredientPreferredSupplier={
              this.checkSelectedIngredientPreferredSupplier
            }
          />
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
          <div>{supplierPanel}</div>
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
