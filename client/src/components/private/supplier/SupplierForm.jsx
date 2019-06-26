import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
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
      getSelectedValue,
      selectedSupplier: { packetCost, packetGrams, preferred },
      errors
    } = this.props;

    let options;
    console.log(this.props.supplier);
    if (supplier.suppliers.length !== 0) {
      options = supplier.suppliers.map(supplier => {
        let selectData = {};
        selectData.label = supplier.displayName;
        selectData.value = supplier._id;
        return selectData;
      });
    }

    // console.log(options);

    // const options = [
    //   { value: '893246923', label: 'Veggie Bar' },
    //   { value: '891273219', label: 'New Farm' },
    //   { value: '891273', label: 'Peachy' }
    // ];

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
          <CreatableSelectInput
            name="type"
            placeholder="Select Ingredient Supplier..."
            options={options}
            getSelectedValue={this.props.getSelectedValue}
            error={errors.type && errors.type}
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
