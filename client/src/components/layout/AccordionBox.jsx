import React, { Component } from 'react';
import { isEmpty } from '../../utils/utils';
import arrow from '../../images/arrow.svg';

class AccordionBox extends Component {
  state = {
    status: 'closed'
  };

  componentDidMount = () => {
    const { isOpen } = this.props;
    const { status } = this.state;
    if (isOpen && status === 'closed') {
      this.setState({ status: 'open' });
    }
  };

  changeStatus = () => {
    const { status } = this.state;
    const updatedStatus = status === 'closed' ? 'open' : 'closed';

    this.setState({ status: updatedStatus });
  };

  render() {
    const { headerText, children, isOpen } = this.props;
    const { status } = this.state;

    return (
      <section className={`accordion accordion-${status}`}>
        <div
          onClick={this.changeStatus}
          className={`accordionHeader  `}
        >
          {headerText && headerText}
          <div className="dropdownIcon">
            <img
              src={arrow}
              alt="Exit icon to represent the logout link"
            />
          </div>
        </div>
        {status === 'open' && (
          <div className="accordionBody">{children}</div>
        )}
      </section>
    );
  }
}

export default AccordionBox;
