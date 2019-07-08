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
import {
  updateSelectedSupplierState,
  getSelectedSupplier,
  setPreferredSupplier,
  updatePreferredSupplier
} from '../supplier/supplierActions';
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
    // console.log('I RAN');
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
        console.log('slSupplier', slSupplier);
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
    const { selectedIngredient } = this.state;

    // If selected ingredient changes update local state with selected ingredient
    if (
      prevProps.ingredient.selectedIngredient !==
      ingredient.selectedIngredient
    ) {
      this.setState({
        selectedIngredient: ingredient.selectedIngredient
      });
    }

    if (
      prevState.selectedIngredient !== selectedIngredient &&
      prevProps.preferredIngredientSupplierId !==
        this.props.preferredIngredientSupplierId
    ) {
      console.log('Fixed');

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

      const usIngredient = {
        ...selectedIngredient,
        suppliers: updateSelectedIngredientSuppliersState
      };

      this.setState({
        selectedIngredient: usIngredient
      });
    }

    // If selected supplier changes update local state with selected supplier
    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
      this.setState({
        selectedSupplier: supplier.selectedSupplier
      });
    }

    // If preferredIngredientSupplierId changes update local state to
    // match the preferredIngredientSupplierId
    if (
      prevProps.supplier.preferredIngredientSupplierId !==
      supplier.preferredIngredientSupplierId
    ) {
      if (!isEmpty(selectedIngredient.suppliers)) {
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

        const usIngredient = {
          ...selectedIngredient,
          suppliers: updateSelectedIngredientSuppliersState
        };

        this.setState({
          selectedIngredient: usIngredient
        });
      } else {
        console.log(
          'Current local state selected ingredient has no suppliers'
        );
      }

      if (!isEmpty(this.state.selectedSupplier.supplier._id)) {
        const usSupplier = {
          ...this.state.selectedSupplier
        };

        if (
          supplier.preferredIngredientSupplierId ===
          supplier.selectedSupplier.supplier._id
        ) {
          usSupplier.preferred = true;
        } else {
          usSupplier.preferred = false;
        }

        this.setState({
          selectedSupplier: usSupplier
        });
      } else {
        const usSupplier = {
          ...supplier.selectedSupplier
        };

        if (
          supplier.preferredIngredientSupplierId ===
          supplier.selectedSupplier.supplier._id
        ) {
          usSupplier.preferred = true;
        } else {
          usSupplier.preferred = false;
        }

        this.setState({
          selectedSupplier: usSupplier
        });
      }
    }

    // Check if ingredient is ready to be saved
    if (prevState.selectedSupplier !== this.state.selectedSupplier) {
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
    console.log('selectedValue', this.props.supplier.suppliers);
    this.props.getSelectedSupplier(
      selectedValue,
      this.props.supplier.suppliers,
      this.props.ingredient.selectedIngredient
    );
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

    // console.log('RTS: selectedSupplier', this.state.selectedSupplier);

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
      if (!isEmpty(selectedIngredient._id)) {
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
            <IngredientForm
              selectedIngredient={selectedIngredient}
              handleIngredientNumberChange={
                this.handleIngredientNumberChange
              }
              readyToSave={readyToSave}
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
