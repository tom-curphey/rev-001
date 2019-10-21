import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../layout/input/TextInput';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInputBorderHorizontal from '../../layout/input/CreatableSelectInputBorderHorizontal';
import {
  isEmpty,
  roundNumberAsString,
  convert100gInto1Kg
} from '../../../utils/utils';

const SupplierDetailsForm = ({
  selectedSupplier,
  handleSubmit,
  errors,
  handleChange
}) => {
  console.log('selectedSupplier**', selectedSupplier);

  return (
    <section className="supplierDetailsForm">
      {/* <h2>Add New Ingredient Metric Weight</h2> */}
      <form>
        <TextInput
          label="Supplier Email"
          value={selectedSupplier.email}
          name="email"
          onChange={handleChange}
          error={errors.email && errors.email}
          autoFocus={true}
        />
        <div className="button">
          <nav className="readyToSaveClass" onClick={handleSubmit}>
            Save Supplier
          </nav>
        </div>
      </form>
    </section>
  );
};

SupplierDetailsForm.propTypes = {
  selectedSupplier: PropTypes.object.isRequired
  // getSelectedSupplier: PropTypes.func.isRequired,
  // handleSupplierChange: PropTypes.func.isRequired,
  // handleSupplierNumberChange: PropTypes.func.isRequired,
  // handleToggleChange: PropTypes.func.isRequired
};

export default SupplierDetailsForm;
