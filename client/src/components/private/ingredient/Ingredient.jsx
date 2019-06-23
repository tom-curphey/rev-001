import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import {
  loadIngredients,
  setSelectedIngredient
} from './ingredientActions';
import SelectIngredient from './SelectIngredient';
import SupplierForm from '../supplier/SupplierForm';
import IngredientForm from '../ingredient/IngredientForm';

class Ingredients extends Component {
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
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        // console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal !== -1) {
          value = e.target.value;
        }
        e.persist();
        this.setState(prevState => ({
          selectedSupplier: {
            ...prevState.selectedSupplier,
            [e.target.name]: e.target.value
          }
        }));
      }
    } else {
      e.persist();
      this.setState(prevState => ({
        selectedSupplier: {
          ...prevState.selectedSupplier,
          [e.target.name]: e.target.value
        }
      }));
    }
  };

  handleSubmit = () => {
    console.log('STATE:', this.state);
  };

  render() {
    const { ingredient } = this.props;
    const {
      selectedIngredient,
      selectedSupplier,
      readyToSave
    } = this.state;

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
                  handleSupplierChange={this.handleSupplierChange}
                  handleSupplierNumberChange={
                    this.handleSupplierNumberChange
                  }
                />
              )}
            {selectedIngredient && (
              <div className="button">
                <nav
                  className={readyToSave && 'readyToSave'}
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

Ingredients.propTypes = {
  ingredient: PropTypes.object,
  profile: PropTypes.object,
  loadIngredients: PropTypes.func.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired
};

const actions = {
  loadIngredients,
  setSelectedIngredient
};

const mapState = state => ({
  ingredient: state.ingredient,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(Ingredients);
