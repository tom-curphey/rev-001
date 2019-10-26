import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredientAndSupplier,
  removeSelectedIngredient,
  updateReduxIngredientState
} from './ingredientActions';
import {
  loadSuppliers,
  setPreferredSupplier,
  updateSelectedSupplierState,
  getSelectedSupplier,
  updatePreferredSupplier,
  removeSelectedSupplier,
  removePreferredSupplier
} from '../supplier/supplierActions';
import { removeErrors, setErrors } from '../../../redux/errorActions';
import SelectIngredient from './SelectIngredient';
import SupplierForm from '../supplier/SupplierForm';
import IngredientForm from './IngredientForm';
import SupplierPanel from '../supplier/SupplierPanel';
import TextInput from '../../layout/input/TextInput';
import {
  isEmpty,
  convertProfilePacketCostIntoCostPer1kg
} from '../../../utils/utils';
import editIcon from '../../../images/edit.svg';

export class Ingredient extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        profilePacketCost: '',
        profilePacketGrams: '',
        preferred: false
      },
      readyToSave: false,
      displayIngredientNameForm: false,
      selectedIngredientChanged: false
    };
  }

  componentDidMount() {
    this.props.loadIngredients();
    const { ingredient, supplier } = this.props;

    if (isEmpty(supplier.suppliers)) {
      this.props.loadSuppliers();
    }
    if (!isEmpty(ingredient.selectedIngredient)) {
      if (isEmpty(ingredient.selectedIngredient.displayName)) {
        this.setState({
          displayIngredientNameForm: true,
          selectedIngredient: ingredient.selectedIngredient
        });
      } else {
        this.setState({
          selectedIngredient: ingredient.selectedIngredient
        });
      }
    }
    if (
      !isEmpty(supplier.selectedSupplier) &&
      !isEmpty(supplier.suppliers)
    ) {
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
    const { ingredient, supplier, errors } = this.props;
    const {
      selectedIngredient,
      selectedSupplier,
      displayIngredientNameForm,
      selectedIngredientChanged
    } = this.state;
    if (
      prevProps.supplier.suppliers !== supplier.suppliers &&
      isEmpty(supplier.suppliers)
    ) {
      this.props.loadSuppliers();
    }

    // If selected ingredient changes update local state with selected ingredient
    if (
      prevProps.ingredient.selectedIngredient !==
      ingredient.selectedIngredient
    ) {
      if (isEmpty(errors)) {
        this.setState({
          selectedIngredient: ingredient.selectedIngredient,
          displayIngredientNameForm: false,
          selectedIngredientChanged: true
        });
      }
    }

    // if (
    //   prevState.displayIngredientNameForm !==
    //   displayIngredientNameForm
    // ) {
    //   if (displayIngredientNameForm) {
    //     console.log(
    //       'UPDATE displayIngredientNameForm',
    //       this.state.displayIngredientNameForm
    //     );
    //     this.setState({
    //       displayIngredientNameForm: false
    //     });
    //   }
    // }

    // If selected supplier changes update local state with selected supplier
    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
      console.log('***UPDATED HERE 1***');

      // Check if props selected supplier !== null
      if (!isEmpty(supplier.selectedSupplier)) {
        console.log('You caught me', supplier.selectedSupplier);
        console.log('***UPDATED HERE 2***', selectedIngredient);

        if (!isEmpty(selectedIngredient.suppliers)) {
          const statePreferredSupplier = this.state.selectedIngredient.suppliers.filter(
            sis => {
              return sis.preferred === true;
            }
          );
          console.log('***UPDATED HERE 3***', statePreferredSupplier);
          // Check is selected ingredient has a preferred supplier
          if (!isEmpty(statePreferredSupplier)) {
            console.log('***UPDATED HERE 4***', supplier);
            console.log(
              '***UPDATED HERE 4***',
              supplier.preferredIngredientSupplierId
            );
            if (!isEmpty(supplier.preferredIngredientSupplierId)) {
              console.log('***UPDATED HERE 5***');
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
              console.log(
                'Just trying to run here',
                supplier.selectedSupplier
              );

              if (
                prevProps.ingredient.selectedIngredient !==
                ingredient.selectedIngredient
              ) {
                this.setState({
                  selectedIngredient: ingredient.selectedIngredient,
                  selectedSupplier: supplier.selectedSupplier
                });
              } else {
                this.setState({
                  selectedSupplier: supplier.selectedSupplier
                });
              }
            }
          } else {
            console.log(
              'state had no preferred supplier',
              supplier.selectedSupplier
            );

            const usSupplier = {
              ...supplier.selectedSupplier,
              preferred: false,
              profilePacketCost: !isEmpty(
                supplier.selectedSupplier.profilePacketCost
              )
                ? supplier.selectedSupplier.profilePacketCost.toString()
                : convertProfilePacketCostIntoCostPer1kg(
                    supplier.selectedSupplier.packetCost,
                    supplier.selectedSupplier.packetGrams
                  ).toString(),
              profilePacketGrams: !isEmpty(
                supplier.selectedSupplier.profilePacketGrams
              )
                ? supplier.selectedSupplier.profilePacketGrams.toString()
                : '1000'
            };

            console.log('usSupplier ***', usSupplier);

            const usiSuppliers = selectedIngredient.suppliers.map(
              sis => {
                if (sis.supplier._id === usSupplier.supplier._id) {
                  if (!sis.profilePacketCost) {
                    sis.preferred = false;
                    sis.profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                      usSupplier.profilePacketCost,
                      usSupplier.profilePacketGrams
                    ).toString();
                    sis.profilePacketGrams = '1000';
                    return sis;
                  }
                }
                return sis;
              }
            );

            const updatedSelectedIngredient = {
              ...selectedIngredient,
              suppliers: usiSuppliers
            };

            console.log(
              'state had no preferred supplier **',
              usSupplier
            );
            console.log(
              'state had no preferred supplier **',
              updatedSelectedIngredient
            );

            this.setState({
              selectedSupplier: usSupplier,
              selectedIngredient: updatedSelectedIngredient
              // selectedSupplier: supplier.selectedSupplier
            });
          }
        } else {
          // Selected ingredient has no suppliers for this profile
          console.log('You slipt past me', supplier.selectedSupplier);

          const usSupplier = {
            ...supplier.selectedSupplier,
            profilePacketCost: !isEmpty(
              supplier.selectedSupplier.profilePacketCost
            )
              ? supplier.selectedSupplier.profilePacketCost
              : convertProfilePacketCostIntoCostPer1kg(
                  supplier.selectedSupplier.packetCost,
                  supplier.selectedSupplier.packetGrams
                ).toString(),
            profilePacketGrams: !isEmpty(
              supplier.selectedSupplier.profilePacketGrams
            )
              ? supplier.selectedSupplier.profilePacketGrams.toString()
              : '1000'
          };

          const usiSuppliers = selectedIngredient.suppliers.map(
            sis => {
              if (sis.supplier._id === usSupplier.supplier._id) {
                if (!sis.profilePacketCost) {
                  sis.profilePacketCost = convertProfilePacketCostIntoCostPer1kg(
                    usSupplier.profilePacketCost,
                    usSupplier.profilePacketGrams
                  ).toString();
                  sis.profilePacketGrams = '1000';
                  return sis;
                }
              }
              return sis;
            }
          );

          const updatedSelectedIngredient = {
            ...selectedIngredient,
            suppliers: usiSuppliers
          };

          console.log('You slipt past me **>', usSupplier);
          console.log(
            'You slipt past me **>',
            updatedSelectedIngredient
          );

          this.setState({
            selectedSupplier: usSupplier
            // selectedIngredient: updatedSelectedIngredient
            // selectedSupplier: supplier.selectedSupplier
          });
        }

        // If props selected supplier is equal to preferred run setPreferredSupplier action

        if (supplier.selectedSupplier.preferred) {
          if (
            isEmpty(supplier.preferredIngredientSupplierId) ||
            supplier.preferredIngredientSupplierId ===
              supplier.selectedSupplier.supplier._id
          ) {
            console.log(
              '**** This set the prefered supplier id correctly'
            );

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
            profilePacketCost: '',
            profilePacketGrams: '',
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
        if (isEmpty(selectedIngredient._id)) {
          console.log('CHECK MATE', selectedIngredient);

          correctIngredient = { ...selectedIngredient };
        } else {
          correctIngredient = {
            ...this.props.ingredient.selectedIngredient
          };
        }
      } else {
        correctIngredient = { ...this.state.selectedIngredient };
      }

      const usIngredient = {
        ...correctIngredient,
        suppliers: updateSelectedIngredientSuppliersState
      };

      let usSupplier;

      console.log('Right here 1', selectedSupplier); // state
      console.log('Right here 2', supplier); // props
      console.log(
        'selectedIngredientChanged',
        this.state.selectedIngredientChanged
      );

      if (
        !isEmpty(selectedSupplier.supplier._id) &&
        selectedIngredientChanged === false
      ) {
        usSupplier = {
          ...selectedSupplier
          // ...supplier.selectedSupplier
        };
      } else {
        usSupplier = {
          ...supplier.selectedSupplier
        };
        this.setState({ selectedIngredientChanged: false });
      }

      if (
        selectedSupplier.supplier._id !==
        supplier.selectedSupplier.supplier._id
      ) {
        console.log('ERROR HERE');
        console.log('Right here 1 STATE', selectedSupplier); // state
        console.log('Right here 2 PROPS', supplier); // props
        usSupplier = {
          ...supplier.selectedSupplier
        };
      }

      if (
        supplier.preferredIngredientSupplierId ===
        selectedSupplier.supplier._id
      ) {
        usSupplier.preferred = true;
      } else {
        usSupplier.preferred = false;
      }

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

  componentWillUnmount() {
    if (this.props.errors) {
      this.props.removeErrors();
    }

    this.props.removeSelectedIngredient();
    this.props.removeSelectedSupplier();
    this.props.removePreferredSupplier();
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

    // If the state has a preferred supplier do not change the preferred supplier
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

  handleSelectSupplier = (supplierID, displayName) => e => {
    const selectedValue = {
      label: displayName,
      value: supplierID
    };
    this.getSelectedSupplier(selectedValue);
  };

  addNewSupplierButtonClicked = () => {
    const selectedValue = {
      label: '',
      value: '',
      __isNew__: true
    };
    this.getSelectedSupplier(selectedValue);
  };

  displayEditIngredientNameForm = () => {
    this.setState({
      displayIngredientNameForm: true
    });

    document
      .getElementById('ingredientTextBox')
      .classList.add('editIngredientNameTextBox');
  };

  handleIngredientNameChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedIngredient: {
        ...prevState.selectedIngredient,
        displayName: e.target.value
      }
    }));
  };

  updateIngredientName = () => {
    if (isEmpty(this.state.selectedIngredient.displayName)) {
      this.props.setErrors({
        displayName: 'Ingredient name is required'
      });
    } else {
      this.setState({
        displayIngredientNameForm: false
      });
      document
        .getElementById('ingredientTextBox')
        .classList.remove('editIngredientNameTextBox');
      this.props.removeErrors();
      this.props.updateReduxIngredientState(
        this.state.selectedIngredient
      );
    }
    if (this.state.readyToSave) {
      this.handleSubmit();
    }
  };

  handleEnterKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.state.readyToSave) {
        this.handleSubmit();
      }
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
        ingredientData._id = selectedIngredient._id;
        ingredientData.displayName = selectedIngredient.displayName;
        ingredientData.metrics.cup = selectedIngredient.metrics.cup;
        ingredientData.metrics.whole =
          selectedIngredient.metrics.whole;
        ingredientData.suppliers = selectedIngredient.suppliers;
      } else {
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
    const { ingredient, errors } = this.props;
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave,
      displayIngredientNameForm
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
      // Thanks for much for indicating that this Ingredient's name is incorrect
      // This ingredient has been used by other Recipe Revenue Chefs chefs in their recipes
      // To ensure the ingredient names are consistent for every one your suggestion will be reviewed
      // We will email you promptly informing you of the outcome.

      // Please note Ingredient names are only reserved for the ingredients name
      // any branding, price labeling or measurement declaration can be changed below

      if (!isEmpty(ingredient.selectedIngredient)) {
        ingredientForm = (
          <Fragment>
            <div
              ref={this.ingredientTextBox}
              id="ingredientTextBox"
              className="editIngredientName"
            >
              {displayIngredientNameForm ? (
                <Fragment>
                  <form>
                    <TextInput
                      label="Ingredient Name"
                      value={selectedIngredient.displayName}
                      name="displayName"
                      onChange={this.handleIngredientNameChange}
                      onBlur={this.updateIngredientName}
                      type="text"
                      error={errors.displayName && errors.displayName}
                      autoFocus={true}
                      onKeyDown={this.handleEnterKeyDown}
                    />
                  </form>
                </Fragment>
              ) : (
                <Fragment>
                  <SelectIngredient />
                  <div
                    className="ingredientNameEditIcon"
                    onClick={this.displayEditIngredientNameForm}
                  >
                    <img
                      src={editIcon}
                      alt="Edit icon to represent the changing the ingredient name"

                      // onMouseOver={this.onChangeRecipeHover}
                      // onMouseOut={this.onChangeRecipeHover}
                    />
                  </div>
                </Fragment>
              )}
              {errors.ingredient && (
                <span className="errorMsg">{errors.ingredient}</span>
              )}
            </div>

            {isEmpty(selectedIngredient._id) && (
              <IngredientForm
                selectedIngredient={selectedIngredient}
                handleIngredientNumberChange={
                  this.handleIngredientNumberChange
                }
                readyToSave={readyToSave}
              />
            )}
            <SupplierForm
              selectedSupplier={selectedSupplier}
              getSelectedSupplier={this.getSelectedSupplier}
              handleSupplierChange={this.handleSupplierChange}
              handleSupplierNumberChange={
                this.handleSupplierNumberChange
              }
              handleToggleChange={this.handleToggleChange}
            />

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
              handleSelectSupplier={this.handleSelectSupplier}
              addNewSupplierButtonClicked={
                this.addNewSupplierButtonClicked
              }
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

Ingredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  loadIngredients: PropTypes.func.isRequired,
  loadSuppliers: PropTypes.func.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  addOrEditIngredientAndSupplier: PropTypes.func.isRequired,
  updateSelectedSupplierState: PropTypes.func.isRequired,
  getSelectedSupplier: PropTypes.func.isRequired,
  setPreferredSupplier: PropTypes.func.isRequired,
  updatePreferredSupplier: PropTypes.func.isRequired,
  removeSelectedIngredient: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired,
  removePreferredSupplier: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  loadSuppliers,
  setSelectedIngredient,
  addOrEditIngredientAndSupplier,
  updateSelectedSupplierState,
  getSelectedSupplier,
  setPreferredSupplier,
  updatePreferredSupplier,
  setErrors,
  removeErrors,
  removeSelectedIngredient,
  removeSelectedSupplier,
  removePreferredSupplier,
  updateReduxIngredientState
};

const mapState = state => ({
  ingredient: state.ingredient,
  supplier: state.supplier,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(Ingredient);
