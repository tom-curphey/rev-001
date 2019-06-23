import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import Spinner from '../../layout/Spinner';

class SupplierForm extends Component {
  // state = {
  //   // packetGrams: '',
  //   // packetCost: '',
  //   // preferred: '',
  //   selectedSupplierID: ''
  // };

  render() {
    const {
      ingredient,
      supplier,
      selectedSupplier: { packetCost, packetGrams, preferred },
      errors
    } = this.props;

    return (
      <section className="supplierForm">
        <form onSubmit={this.handleOnSubmit}>
          <TextInputHorizontal
            label="Supplier Packet Cost"
            value={packetCost}
            name="packetCost"
            labelClass="smallTextField"
            onChange={this.props.handleSupplierNumberChange}
            error={errors && errors.packetCost}
          />
          <TextInputHorizontal
            label="Supplier Packet Grams"
            value={packetGrams}
            name="packetGrams"
            labelClass="smallTextField"
            onChange={this.props.handleSupplierNumberChange}
            error={errors && errors.packetGrams}
          />
          <TextInputHorizontal
            label="Prefered Supplier"
            value={preferred}
            name="preferred"
            onChange={this.props.handleSupplierChange}
            error={errors && errors.preferred}
          />
        </form>
      </section>
    );
  }
}

SupplierForm.propTypes = {
  ingredient: PropTypes.object.isRequired,
  supplier: PropTypes.object.isRequired,
  handleSupplierChange: PropTypes.func.isRequired,
  handleSupplierNumberChange: PropTypes.func.isRequired
};

const actions = {};

const mapState = state => ({
  ingredient: state.ingredient,
  supplier: state.supplier,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(SupplierForm);
