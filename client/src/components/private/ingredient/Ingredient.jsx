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
  setPreferredSupplier,
  setSelectedSupplier,
  removeSelectedSupplier,
  updateSelectedSupplierState,
  getSelectedSupplier,
  updatePreferredSupplier
} from '../supplier/supplierActions';
import SelectIngredient from './SelectIngredient';
import SupplierForm from '../supplier/SupplierForm';
import IngredientForm from './IngredientForm';
import SupplierPanel from '../supplier/SupplierPanel';
import { isEmpty } from '../../../utils/utils';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';

export class Ingredient extends Component {
  state = {
    selectedIngredient: {
      metrics: {
        whole: '',
        cup: ''
      },
      suppliers: []
    },
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
    this.props.loadIngredients();
    this.props.loadSuppliers();

    const { ingredient, supplier } = this.props;
    if (!isEmpty(ingredient.selectedIngredient)) {
      this.setState({
        selectedIngredient: ingredient.selectedIngredient
      });
    }
    if (!isEmpty(supplier.selectedSupplier)) {
      setPreferredSupplier(supplier.selectedSupplier.supplier._id);

      const slSupplier = supplier.suppliers.filter(sls => {
        return sls._id === supplier.selectedSupplier.supplier._id;
      });

      if (!isEmpty(slSupplier)) {
        const usiSupplier = {
          ...supplier.selectedSupplier,
          supplier: {
            ...supplier.selectedSupplier.supplier,
            address: slSupplier[0].address,
            confirmedDetails: slSupplier[0].confirmedDetails,
            email: slSupplier[0].email,
            phone: slSupplier[0].phone,
            urlName: slSupplier[0].urlName,
            website: slSupplier[0].website
          }
        };
        this.props.updateSelectedSupplierState(usiSupplier);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { ingredient, supplier } = this.props;
    const { selectedIngredient, selectedSupplier } = this.state;

    // If selected ingredient changes update local state with selected ingredient
    if (
      prevProps.ingredient.selectedIngredient !==
      ingredient.selectedIngredient
    ) {
      this.setState({
        selectedIngredient: ingredient.selectedIngredient
      });
    }

    // If selected supplier changes update local state with selected supplier
    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
      // Check if props selected supplier !== null
      if (supplier.selectedSupplier !== null) {
        console.log('You caught me', supplier.selectedSupplier);

        if (!isEmpty(selectedIngredient.suppliers)) {
          const statePreferredSupplier = this.state.selectedIngredient.suppliers.filter(
            sis => {
              return sis.preferred === true;
            }
          );

          // Check is state has a preferred supplier
          if (!isEmpty(statePreferredSupplier)) {
            if (!isEmpty(supplier.preferredIngredientSupplierId)) {
              if (
                supplier.selectedSupplier.supplier._id ===
                supplier.preferredIngredientSupplierId
              ) {
                console.log('YEP - IDs match');
                const updatedSelectedSupplier = {
                  ...supplier.selectedSupplier,
                  preferred: true
                };
                this.setState({
                  selectedSupplier: updatedSelectedSupplier
                });
              } else {
                console.log('Got Past');
                if (supplier.selectedSupplier.preferred) {
                  console.log('preferred');
                  if (
                    supplier.selectedSupplier.supplier._id !==
                    supplier.preferredIngredientSupplierId
                  ) {
                    const updatedSelectedSupplier = {
                      ...supplier.selectedSupplier,
                      preferred: false
                    };
                    this.setState({
                      selectedSupplier: updatedSelectedSupplier
                    });
                  }
                } else {
                  console.log(
                    'Props selected supplier is not preferred'
                  );
                  this.setState({
                    selectedSupplier: supplier.selectedSupplier
                  });
                }
              }
            } else {
              console.log('Just trying to run here');
              this.setState({
                selectedSupplier: supplier.selectedSupplier
              });
            }
          } else {
            console.log('state had no preferred supplier');
            this.setState({
              selectedSupplier: supplier.selectedSupplier
            });
          }
        } else {
          console.log('You slipt past me', supplier.selectedSupplier);
          this.setState({
            selectedSupplier: supplier.selectedSupplier
          });
        }

        // If props selected supplier is equal to preferred run setPreferredSupplier action

        if (supplier.selectedSupplier.preferred) {
          if (
            isEmpty(supplier.preferredIngredientSupplierId) ||
            supplier.preferredIngredientSupplierId ===
              supplier.selectedSupplier.supplier._id
          ) {
            this.props.setPreferredSupplier(
              supplier.selectedSupplier.supplier._id
            );
          }
        }
      } else {
        console.log('I TRIED ---', supplier.selectedSupplier);

        this.setState({
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
          }
        });
      }
    }

    if (
      prevProps.supplier.preferredIngredientSupplierId !==
        supplier.preferredIngredientSupplierId &&
      supplier.selectedSupplier !== null
    ) {
      const updateSelectedIngredientSuppliersState = selectedIngredient.suppliers.map(
        sis => {
          if (
            sis.supplier._id ===
            supplier.preferredIngredientSupplierId
          ) {
            return {
              ...sis,
              preferred: true
            };
          } else {
            return {
              ...sis,
              preferred: false
            };
          }
        }
      );

      let correctIngredient;

      if (
        this.props.ingredient.selectedIngredient !==
        this.state.selectedIngredient
      ) {
        correctIngredient = {
          ...this.props.ingredient.selectedIngredient
        };
      } else {
        correctIngredient = { ...this.state.selectedIngredient };
      }

      const usIngredient = {
        ...correctIngredient,
        suppliers: updateSelectedIngredientSuppliersState
      };

      const usSupplier = {
        ...supplier.selectedSupplier
      };

      if (
        supplier.preferredIngredientSupplierId ===
        selectedSupplier.supplier._id
      ) {
        usSupplier.preferred = true;
      } else {
        usSupplier.preferred = false;
      }

      console.log('Right here', usIngredient);

      this.setState({
        selectedIngredient: usIngredient,
        selectedSupplier: usSupplier
      });
    }

    if (prevState.selectedSupplier !== this.state.selectedSupplier) {
      // Check if ingredient is ready to be saved
      this.checkReadyToSave();
    }
  }

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

  handleToggleChange = e => {
    this.props.updatePreferredSupplier(
      this.state.selectedSupplier,
      this.props.ingredient.selectedIngredient
    );
  };

  getSelectedSupplier = selectedValue => {
    const statePreferredSupplier = this.state.selectedIngredient.suppliers.filter(
      sis => {
        return sis.preferred === true;
      }
    );

    // If the state has a preferred supplier do not chnage the preferred supplier
    if (!isEmpty(statePreferredSupplier)) {
      this.props.getSelectedSupplier(
        selectedValue,
        this.props.supplier.suppliers,
        this.props.ingredient.selectedIngredient,
        true
      );
    } else {
      this.props.getSelectedSupplier(
        selectedValue,
        this.props.supplier.suppliers,
        this.props.ingredient.selectedIngredient
      );
    }
  };

  checkReadyToSave = () => {
    const {
      selectedIngredient: {
        metrics: { cup, whole }
      },
      selectedSupplier: {
        supplier,
        profilePacketCost,
        profilePacketGrams
      }
    } = this.state;

    if (
      (!isEmpty(cup) || !isEmpty(whole)) &&
      !isEmpty(supplier._id) &&
      !isEmpty(profilePacketCost) &&
      !isEmpty(profilePacketGrams)
    ) {
      this.setState({ readyToSave: true });
    } else {
      this.setState({ readyToSave: false });
    }
  };

  handleSubmit = () => {
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
        ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        ingredientData.metrics.whole =
          selectedIngredient.metrics.whole;
        ingredientData.suppliers = selectedIngredient.suppliers;
      } else {
        console.log('Add new ingredient');
        ingredientData.displayName = selectedIngredient.displayName;
        ingredientData.metrics.cup = selectedIngredient.metrics.cup;
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
      if (!isEmpty(selectedIngredient.displayName)) {
        ingredientForm = (
          <Fragment>
            <SelectIngredient />
            <SupplierForm
              selectedSupplier={selectedSupplier}
              getSelectedSupplier={this.getSelectedSupplier}
              handleSupplierChange={this.handleSupplierChange}
              handleSupplierNumberChange={
                this.handleSupplierNumberChange
              }
              handleToggleChange={this.handleToggleChange}
            />
            {isEmpty(selectedIngredient._id) && (
              <IngredientForm
                selectedIngredient={selectedIngredient}
                handleIngredientNumberChange={
                  this.handleIngredientNumberChange
                }
                readyToSave={readyToSave}
              />
            )}
            <div className="button">
              <nav
                className={readyToSaveClass}
                onClick={this.handleSubmit}
              >
                Save Ingredient
              </nav>
            </div>
          </Fragment>
        );

        supplierPanel = (
          <Fragment>
            <SupplierPanel
              selectedIngredient={selectedIngredient}
              selectedSupplier={selectedSupplier}
            />
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
  }
}

const actions = {
  loadIngredients,
  loadSuppliers,
  setSelectedIngredient,
  addOrEditIngredientAndSupplier,
  updateSelectedSupplierState,
  getSelectedSupplier,
  setPreferredSupplier,
  updatePreferredSupplier
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
