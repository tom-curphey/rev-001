import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInputBorderHorizontal from '../../layout/input/CreatableSelectInputBorderHorizontal';
import {
  isEmpty,
  roundNumberAsString,
  convert100gInto1Kg
} from '../../../utils/utils';

const SupplierDetailsForm = () => {
  return <section className="supplierDetailsForm">Form</section>;
};

SupplierDetailsForm.propTypes = {
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
)(SupplierDetailsForm);
