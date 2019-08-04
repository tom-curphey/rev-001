import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import { isEmpty } from '../../../utils/utils';
import { updateReduxSelectedRecipe } from './recipeActions';
import SelectRecipe from './SelectRecipe';
import TextInput from '../../layout/input/TextInput';
import { setErrors } from '../../../redux/errorActions';
import HoverTextInput from '../../layout/input/HoverTextInput';
import editIcon from '../../../images/edit.svg';
import sortIcon from '../../../images/sort.svg';
import printIcon from '../../../images/print.svg';

class RecipeDetailsHeader extends Component {
  state = {
    selectedRecipe: {
      serves: '',
      salePricePerServe: '',
      expectedSales: ''
    },
    displayRecipeNameForm: true,
    changeRecipeHover: false,
    printRecipeHover: false,
    editRecipeHover: false
  };

  componentDidMount() {
    if (!isEmpty(this.props.selectedRecipe)) {
      const { selectedRecipe } = this.props;
      const recipeData = {
        ...selectedRecipe,
        serves: selectedRecipe.serves
          ? selectedRecipe.serves.toString()
          : '',
        salePricePerServe: selectedRecipe.salePricePerServe
          ? selectedRecipe.salePricePerServe.toString()
          : '',
        expectedSales: selectedRecipe.expectedSales
          ? selectedRecipe.expectedSales.toString()
          : ''
      };

      this.setState({
        selectedRecipe: recipeData
      });
    }
  }

  componentDidUpdate = prevProps => {
    if (!isEmpty(this.props.selectedRecipe)) {
      const {
        serves,
        salePricePerServe,
        expectedSales
      } = this.props.selectedRecipe;
      if (prevProps.selectedRecipe !== this.props.selectedRecipe) {
        const recipeData = {
          ...this.props.selectedRecipe,
          serves: serves ? serves.toString() : '',
          salePricePerServe: salePricePerServe
            ? salePricePerServe.toString()
            : '',
          expectedSales: expectedSales ? expectedSales.toString() : ''
        };

        this.setState({
          selectedRecipe: recipeData
        });
      }
    }
  };

  handleRecipeNumberChange = e => {
    if (!isEmpty(this.props.selectedRecipe)) {
      e.persist();
      let value = e.target.value;
      if (!isNaN(value) || value === '') {
        this.setState(prevState => ({
          updated: true,
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [e.target.name]: value
          }
        }));
      }
    } else {
      this.props.selectRecipeError();
    }
  };

  editRecipeName = e => {
    console.log('e.t', e.target.value);
    e.persist();
    this.setState(prevState => ({
      selectedRecipe: {
        ...prevState.selectedRecipe,
        displayName: e.target.value
          .toLowerCase()
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
        urlName: e.target.value
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase()
      }
    }));
  };

  openRecipeNameForm = () => {
    this.setState({ displayRecipeNameForm: true });
  };

  onChangeRecipe = () => {
    this.setState({
      selectedRecipe: {
        serves: '',
        salePricePerServe: '',
        expectedSales: ''
      }
    });
    this.props.updateReduxSelectedRecipe(null);
  };

  updateReduxSelectedRecipeHeader = () => {
    const { selectedRecipe } = this.state;
    let errors = {};

    if (isEmpty(selectedRecipe.displayName)) {
      console.log('checking', selectedRecipe);
      if (isEmpty(selectedRecipe.displayName))
        errors.recipeDisplayName = 'Please enter recipe name above';
      this.setState({ displayRecipeNameForm: true });
    } else {
      console.log('checking2', selectedRecipe);
      this.setState({ displayRecipeNameForm: false });
    }
    this.props.updateReduxSelectedRecipe(selectedRecipe);
    this.props.setErrors(errors);

    if (!isEmpty(errors)) {
      console.log('Header Recipe', errors);
    }
    console.log(
      'selectedRecipe.displayName',
      selectedRecipe.displayName
    );
  };

  onChangeRecipeHover = () => {
    this.setState({
      changeRecipeHover: !this.state.changeRecipeHover
    });
  };

  onPrintRecipeHover = () => {
    this.setState({
      printRecipeHover: !this.state.printRecipeHover
    });
  };

  onEditRecipeHover = () => {
    this.setState({
      editRecipeHover: !this.state.editRecipeHover
    });
  };

  render() {
    const {
      displayName,
      serves,
      salePricePerServe,
      expectedSales
    } = this.state.selectedRecipe;
    const {
      displayRecipeNameForm,
      changeRecipeHover,
      printRecipeHover,
      editRecipeHover
    } = this.state;
    const { errors, selectRecipeError } = this.props;

    // console.log('selectRecipeError', selectRecipeError);

    return (
      <section className="recipeDetailsHeader">
        <div className="recipeName">
          {displayName || displayName === '' ? (
            <div className="recipeNameForm">
              <img
                src={editIcon}
                alt="Edit icon to represent the editing the recipe name"
                onClick={this.openRecipeNameForm}
                onMouseOver={this.onEditRecipeHover}
                onMouseOut={this.onEditRecipeHover}
              />
              <HoverTextInput
                value={displayName}
                name="recipeName"
                onChange={this.editRecipeName}
                onBlur={this.updateReduxSelectedRecipeHeader}
                type="text"
                // error={errors.displayName && errors.displayName}
                onKeyDown={this.handleEnterKeyDown}
                isForm={displayRecipeNameForm}
              />
            </div>
          ) : (
            <SelectRecipe />
          )}
          <div
            className={`recipeMessages ${
              displayName || displayName === '' ? 'showIcons' : ''
            }`}
          >
            <div className="recipeIcons">
              <img
                src={sortIcon}
                alt="Sort icon to represent the changing to a different recipe"
                onClick={this.onChangeRecipe}
                onMouseOver={this.onChangeRecipeHover}
                onMouseOut={this.onChangeRecipeHover}
              />
              <img
                src={printIcon}
                alt="Print icon to represent printing the recipe"
                onMouseOver={this.onPrintRecipeHover}
                onMouseOut={this.onPrintRecipeHover}
              />
            </div>
            <div>
              {selectRecipeError && (
                <span className="errorMsg">
                  Please select a recipe to start
                </span>
              )}
              {errors && errors.recipeDisplayName && (
                <span className="errorMsg">
                  {errors.recipeDisplayName}
                </span>
              )}
              {errors && errors.recipeIngredients && (
                <span className="errorMsg">
                  {errors.recipeIngredients}
                </span>
              )}
              {changeRecipeHover && (
                <span className="errorMsg">
                  Click to change selected recipe
                </span>
              )}
              {printRecipeHover && (
                <span className="errorMsg">
                  In the future you will be able to print your
                  recipes, ensuring your team produce recipes
                  consistently
                </span>
              )}
              {editRecipeHover && (
                <span className="errorMsg">
                  Click to edit recipe name
                </span>
              )}
            </div>
          </div>
        </div>

        <form onBlur={this.updateReduxSelectedRecipeHeader}>
          <TextInputHorizontal
            label="Recipe Serves"
            value={serves}
            name="serves"
            onChange={this.handleRecipeNumberChange}
            type="text"
            error={errors.serves && errors.serves}
            labelClass="alignTitleRight"
            inputClass="number"
          />
          <TextInputHorizontal
            label="Sale price per serve"
            value={salePricePerServe}
            name="salePricePerServe"
            onChange={this.handleRecipeNumberChange}
            type="text"
            error={
              errors.salePricePerServe && errors.salePricePerServe
            }
            labelClass="alignTitleRight"
            inputClass="number"
          />
          <TextInputHorizontal
            label="Expected Weekly Serve Sales"
            value={expectedSales}
            name="expectedSales"
            onChange={this.handleRecipeNumberChange}
            type="text"
            error={errors.expectedSales && errors.expectedSales}
            labelClass="alignTitleRight"
            inputClass="number"
          />
        </form>
      </section>
    );
  }
}

const actions = {
  updateReduxSelectedRecipe,
  setErrors
};

const mapState = state => ({
  selectedRecipe: state.recipe.selectedRecipe,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(RecipeDetailsHeader);
