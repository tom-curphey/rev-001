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
    readyToSave: null
  };

  componentDidMount() {
    // console.log('I RAN');
    this.props.loadIngredients();
    if (this.props.ingredient.selectedIngredient) {
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.ingredient.selectedIngredient !==
      this.props.ingredient.selectedIngredient
    ) {
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient
      });
    }
  }

  handleSupplierChange = e => {
    console.log(e.target.name);
    e.persist();
    this.setState(prevState => ({
      selectedSupplier: {
        ...prevState.selectedSupplier,
        [e.target.name]: e.target.value
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
      selectedIngredient: { cup, whole }
    } = this.state;

    console.log('this.state', e.target);
    const { name, value } = e.target;
    if (value === '') {
      if (
        (name === 'cup' && !isEmpty(whole)) ||
        (name === 'whole' && !isEmpty(cup))
      ) {
        this.setState({ readyToSave: true });
      } else {
        this.setState({ readyToSave: false });
      }
    } else {
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
  addOrEditIngredient: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  setSelectedIngredient,
  addOrEditIngredient
};

const mapState = state => ({
  ingredient: state.ingredient,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(Ingredient);
