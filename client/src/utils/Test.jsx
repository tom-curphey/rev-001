import React from 'react';
import TextInput from '../components/layout/input/TextInput';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      start: 0,
      isOn: false,
      name: 'Text',
      displayForm: false
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log('TIME', typeof this.state.time);

    if (this.state.time >= 2000 && this.state.isOn === true) {
      console.log('STOPPED');
      this.stopTimer();
    }
  };

  startTimer() {
    this.setState({
      time: 0,
      start: Date.now() - 0,
      isOn: true
    });
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start
        }),
      1000
    );
  }
  stopTimer() {
    this.setState({ isOn: false });
    clearInterval(this.timer);
    console.log('timer', this.timer);
    this.saveIngredient();
  }
  resetTimer() {
    this.setState({ time: 0 });
  }

  onNameChange = e => {
    console.log('CHANGE');
    const { name, value } = e.target;
    clearInterval(this.timer);
    this.setState({ [name]: value });
    this.startTimer();
  };

  saveIngredient = () => {
    console.log('Save ingredient to database');
  };

  handleEnterKeyDown = () => {
    console.log('ENTER');
  };

  render() {
    const { displayForm, name } = this.state;

    let start =
      this.state.time == 0 ? (
        <button onClick={this.startTimer}>start</button>
      ) : null;
    let stop = this.state.isOn ? (
      <button onClick={this.stopTimer}>stop</button>
    ) : null;
    let reset =
      this.state.time != 0 && !this.state.isOn ? (
        <button onClick={this.resetTimer}>reset</button>
      ) : null;
    let resume =
      this.state.time != 0 && !this.state.isOn ? (
        <button onClick={this.startTimer}>resume</button>
      ) : null;
    return (
      <div>
        <h3>time: {this.state.time}</h3>
        {start}
        {resume}
        {stop}
        {reset}
        <br />
        <h3>timer: {this.timer}</h3>
        <form>
          <TextInput
            value={name}
            name="name"
            onChange={this.onNameChange}
            onFocus={this.startTimer}
            type="text"
            // error={errors.displayName && errors.displayName}
            onKeyDown={this.handleEnterKeyDown}
            isForm={displayForm}
          />
        </form>
      </div>
    );
  }
}

export default Test;
