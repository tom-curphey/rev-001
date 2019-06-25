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
  setSelectedSupplier
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
      id: '',
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
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient
      });
    }
    if (this.props.supplier.selectedSupplier) {
      this.setState({
        selectedSupplier: this.props.supplier.selectedSupplier
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.ingredient.selectedIngredient !==
      this.props.ingredient.selectedIngredient
    ) {
      const { selectedIngredient } = this.props.ingredient;

      this.setState({
        selectedIngredient: selectedIngredient
      });

      if (!isEmpty(selectedIngredient.metrics)) {
        this.setState({ readyToSave: true });
      } else {
        this.setState({ readyToSave: false });
      }
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

  getSelectedValue = selectedValue => {
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
          [e.target.name]: value
        }
      }));
      this.checkReadyToSave(e);
    }
  };

  checkReadyToSave = e => {
    const {
      selectedIngredient: { cup, whole },
      selectedSupplier: { id, packetCost, packetGrams, preferred }
    } = this.state;

    console.log('this.state', e.target);
    const { name, value } = e.target;
    if (value === '') {
      switch (name) {
        case 'cup':
          if (
            !isEmpty(whole) &&
            !isEmpty(id) &&
            !isEmpty(packetCost) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        case 'whole':
          if (
            !isEmpty(whole) &&
            !isEmpty(id) &&
            !isEmpty(packetCost) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        default:
          this.setState({ readyToSave: false });
          break;
      }
    } else {
      switch (name) {
        case 'cup':
          if (
            !isEmpty(whole) &&
            !isEmpty(id) &&
            !isEmpty(packetCost) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        case 'whole':
          if (
            !isEmpty(whole) &&
            !isEmpty(id) &&
            !isEmpty(packetCost) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        case 'id':
          if (
            (!isEmpty(cup) || !isEmpty(whole)) &&
            !isEmpty(packetCost) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        case 'packetCost':
          if (
            (!isEmpty(cup) || !isEmpty(whole)) &&
            !isEmpty(id) &&
            !isEmpty(packetGrams)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        case 'packetGrams':
          if (
            (!isEmpty(cup) || !isEmpty(whole)) &&
            !isEmpty(id) &&
            !isEmpty(packetCost)
          ) {
            this.setState({ readyToSave: true });
          }
          break;

        default:
          this.setState({ readyToSave: false });
          break;
      }
    }
  };

  handleSubmit = () => {
    // console.log('STATE:', this.state);
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.state;
    const { id, displayName, cup, whole } = selectedIngredient;

    if (readyToSave) {
      if (!isEmpty(cup) || !isEmpty(whole)) {
        const ingredientData = {
          displayName: displayName,
          cup: cup,
          whole: whole
        };
        if (!isEmpty(id)) {
          ingredientData.id = id;
        }

        this.props.addOrEditIngredient(ingredientData);
      }
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
                getSelectedValue={this.getSelectedValue}
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
  setSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredient,
  loadSuppliers,
  setSelectedSupplier
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
