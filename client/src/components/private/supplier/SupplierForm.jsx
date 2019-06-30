import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInput from '../../layout/input/CreatableSelectInput';
import Spinner from '../../layout/Spinner';
import { isEmpty } from '../../../utils/utils';

class SupplierForm extends Component {
  render() {
    const {
      ingredient,
      supplier,
      getSelectedValue,
      selectedSupplier: {
        _id,
        displayName,
        packetCost,
        packetGrams,
        preferred
      },
      errors
    } = this.props;

    let options;
    console.log(this.props.supplier);
    if (
      !isEmpty(supplier.suppliers) &&
      supplier.suppliers.length !== 0
    ) {
      options = supplier.suppliers.map(supplier => {
        let selectData = {};
        selectData.label = supplier.displayName;
        selectData.value = supplier._id;
        return selectData;
      });
    }

    let selectedValue = {
      label: 'Type supplier name to select supplier..',
      value: 'no-supplier-selected'
    };
    console.log(displayName);

    if (!isEmpty(_id)) {
      selectedValue.label = displayName;
      selectedValue.value = _id;
    }

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
          <ToggleInputHorizontal
            label="Is this your preferred supplier?"
            value={packetGrams}
            name="preferred"
            onChange={this.props.toggleChange}
            toggleOn="Preferred"
            checked={preferred}
          />
          <CreatableSelectInput
            name="type"
            placeholder="Select Ingredient Supplier..."
            value={selectedValue && selectedValue}
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
  handleSupplierNumberChange: PropTypes.func.isRequired,
  toggleChange: PropTypes.func.isRequired
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
