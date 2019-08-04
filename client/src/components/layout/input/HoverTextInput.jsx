import React, { Component } from 'react';
import TextInputNoLabel from '../input/TextInputNoLabel';

class HoverTextInput extends Component {
  state = {
    displayRecipeNameForm: false
  };

  componentDidMount() {
    if (this.props.isForm === true) {
      this.setState({
        displayRecipeNameForm: true
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.isForm === true) {
        this.setState({
          displayRecipeNameForm: this.props.isForm
        });
      }
    }
  }

  displayRecipeNameForm = () => {
    this.setState({
      displayRecipeNameForm: true
    });
  };

  handleOnBlur = () => {
    this.props.onBlur();
    this.setState({ displayRecipeNameForm: false });
  };

  handleEnterKeyDown = e => {
    if (e.key === 'Enter') {
      console.log('in here');

      e.preventDefault();
      this.handleOnBlur();
    }
  };

  render() {
    const { displayRecipeNameForm } = this.state;
    const {
      onBlur,
      onChange,
      onKeyDown,
      value,
      name,
      errors
    } = this.props;

    return (
      <div
        className="changeText"
        onClick={this.displayRecipeNameForm}
      >
        {displayRecipeNameForm ? (
          <form onBlur={this.handleOnBlur}>
            <TextInputNoLabel
              value={value}
              name={name}
              onChange={onChange}
              type="text"
              autoFocus={true}
              // error={errors.displayName && errors.displayName}
              onKeyDown={this.handleEnterKeyDown}
            />
          </form>
        ) : (
          <span onClick={this.getRecipeNameForm}>
            {value && value}
          </span>
        )}
      </div>
    );
  }
}

export default HoverTextInput;
