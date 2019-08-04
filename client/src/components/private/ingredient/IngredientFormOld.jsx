import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SupplierForm from '../supplier/SupplierForm';
import {
  updateSelectedSupplierState,
  getSelectedSupplier,
  setPreferredSupplier,
  updatePreferredSupplier
} from '../supplier/supplierActions';
import { addOrEditIngredientAndSupplier } from './ingredientActions';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
// import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';

class IngredientForm extends Component {
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
    const { ingredient, supplier } = this.props;
    if (!isEmpty(ingredient.selectedIngredient)) {
      this.setState({
        selectedIngredient: ingredient.selectedIngredient
      });
    }
    if (!isEmpty(supplier.selectedSupplier)) {
      this.props.setPreferredSupplier(
        supplier.selectedSupplier.supplier._id
      );

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
    const { supplier } = this.props;
    const { selectedIngredient } = this.state;

    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
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
    console.log('selectedValue', selectedValue);
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
    const { errors } = this.props;
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.state;
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
              onChange={this.handleIngredientNumberChange}
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
          handleSupplierChange={this.handleSupplierChange}
          handleSupplierNumberChange={this.handleSupplierNumberChange}
          getSelectedValue={this.getSelectedSupplier}
          toggleChange={this.handleToggleChange}
        />
        {ingredientForm && ingredientForm}
        <div className="button">
          <nav
            className={readyToSaveClass}
            onClick={this.handleSubmit}
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

const actions = {
  updateSelectedSupplierState,
  addOrEditIngredientAndSupplier,
  getSelectedSupplier,
  setPreferredSupplier,
  updatePreferredSupplier
};

const mapState = state => ({
  errors: state.errors,
  ingredient: state.ingredient,
  supplier: state.supplier
});

export default connect(
  mapState,
  actions
)(IngredientForm);
