import React, { Component } from 'react';
import TextInput from '../input/TextInput';

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
      console.log('HIT', this.props.isForm);
      console.log('HIT', prevProps.isForm);
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
            <TextInput
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
          <h1 onClick={this.getRecipeNameForm}>{value && value}</h1>
        )}
      </div>
    );
  }
}

export default HoverTextInput;
