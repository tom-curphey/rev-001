import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInputHorizontal from '../../layout/input/CreatableSelectInputHorizontal';
import { isEmpty, roundNumberAsString } from '../../../utils/utils';

const SupplierForm = ({
  supplier,
  errors,
  selectedSupplier: {
    supplier: { _id, displayName },
    packetCost,
    packetGrams,
    profilePacketCost,
    profilePacketGrams,
    preferred
  },
  getSelectedSupplier,
  handleSupplierNumberChange,
  handleToggleChange,
  handleOnSubmit
}) => {
  let options;
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
    label: 'Type supplier name..',
    value: 'no-supplier-selected'
  };

  if (!isEmpty(_id)) {
    selectedValue.label = displayName;
    selectedValue.value = _id;
  }

  // console.log('profilePacketCost', profilePacketCost);

  const iPacketCost =
    profilePacketCost === null
      ? roundNumberAsString(packetCost)
      : profilePacketCost.toString();
  const iPacketGrams =
    profilePacketGrams === null
      ? roundNumberAsString(packetGrams)
      : profilePacketGrams.toString();

  return (
    <section className="supplierForm">
      <form onSubmit={handleOnSubmit}>
        <CreatableSelectInputHorizontal
          label="Supplier Name"
          name="type"
          placeholder="Type supplier name.."
          value={selectedValue && selectedValue}
          options={options}
          getSelectedValue={getSelectedSupplier}
          error={errors.type && errors.type}
          createLabel="+ Add Supplier"
        />
        <TextInputHorizontal
          label="Supplier Packet Cost"
          value={iPacketCost}
          name="profilePacketCost"
          labelClass="smallTextField"
          onChange={handleSupplierNumberChange}
          error={errors && errors.packetCost}
        />
        <TextInputHorizontal
          label="Supplier Packet Grams"
          value={iPacketGrams}
          name="profilePacketGrams"
          labelClass="smallTextField"
          onChange={handleSupplierNumberChange}
          error={errors && errors.packetGrams}
        />
        <ToggleInputHorizontal
          label="Is this your preferred supplier?"
          name="preferred"
          onChange={handleToggleChange}
          toggleOn="Preferred"
          checked={preferred}
        />
      </form>
    </section>
  );
};

SupplierForm.propTypes = {
  supplier: PropTypes.object.isRequired,
  getSelectedSupplier: PropTypes.func.isRequired,
  handleSupplierChange: PropTypes.func.isRequired,
  handleSupplierNumberChange: PropTypes.func.isRequired,
  handleToggleChange: PropTypes.func.isRequired
};

const actions = {};

const mapState = state => ({
  supplier: state.supplier,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(SupplierForm);
