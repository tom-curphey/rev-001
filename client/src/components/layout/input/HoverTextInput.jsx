import React, { Component } from 'react';
import TextInputNoLabel from '../input/TextInputNoLabel';

class HoverTextInput extends Component {
  state = {
    displayForm: false
  };

  componentDidMount() {
    if (this.props.isForm === true) {
      this.setState({
        displayForm: true
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.isForm === true) {
        this.setState({
          displayForm: this.props.isForm
        });
      }
    }
  }

  displayForm = () => {
    // this.props.onFocus();
    this.setState({
      displayForm: true
    });
  };

  handleOnBlur = () => {
    // this.props.onBlur();
    this.setState({ displayForm: false });
  };

  handleEnterKeyDown = e => {
    if (e.key === 'Enter') {
      console.log('in here');

      e.preventDefault();
      this.handleOnBlur();
    }
  };

  render() {
    const { displayForm } = this.state;
    const {
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      value,
      name,
      errors
    } = this.props;

    return (
      <div className="changeText" onClick={this.displayForm}>
        {displayForm ? (
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
