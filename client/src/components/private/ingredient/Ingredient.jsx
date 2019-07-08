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
      }
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

    if (
      prevProps.ingredient.selectedIngredient !==
      ingredient.selectedIngredient
    ) {
      this.setState({
        selectedIngredient: ingredient.selectedIngredient
      });
    }

    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
      console.log('RUN RUN', supplier.selectedSupplier.supplier._id);

      this.props.setPreferredSupplier(
        supplier.selectedSupplier.supplier._id
      );

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

    if (
      prevProps.supplier.preferredIngredientSupplierId !==
      supplier.preferredIngredientSupplierId
    ) {
      // Check if preferred supplier ID is === to the state selected supplier id

      // --> Do we need this check?
      // You are trying to unselect the supplier if the props ID is null

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
      }
    }

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
      selectedSupplier: {
        supplier,
        profilePacketCost,
        profilePacketGrams
      }
    } = this.state;

    // console.log('RTS: selectedSupplier', this.state.selectedSupplier);

    if (
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
            <IngredientForm
              selectedIngredient={selectedIngredient}
              handleIngredientNumberChange={
                this.handleIngredientNumberChange
              }
              selectedSupplier={selectedSupplier}
              handleSupplierChange={this.handleSupplierChange}
              handleSupplierNumberChange={
                this.handleSupplierNumberChange
              }
              handleToggleChange={this.handleToggleChange}
              getSelectedSupplier={this.getSelectedSupplier}
              readyToSave={readyToSave}
              handleSubmit={this.handleSubmit}
            />
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
