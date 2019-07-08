import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSelectedSupplierState } from './supplierActions';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInputHorizontal from '../../layout/input/CreatableSelectInputHorizontal';
// import SelectInputHorizontal from '../../layout/input/SelectInputHorizontal';
// import Spinner from '../../layout/Spinner';
import { isEmpty, roundNumberAsString } from '../../../utils/utils';

const SupplierForm = ({
  supplier,
  getSelectedValue,
  errors,
  selectedSupplier: {
    supplier: { _id, displayName },
    packetCost,
    packetGrams,
    profilePacketCost,
    profilePacketGrams,
    preferred
  }
}) => {
  return (
    <div>
      
    </div>
  )
}

export default SupplierForm













class SupplierForm extends Component {

  render() {
    const  = this.props;

    let options;
    if (
      !isEmpty(supplier.suppliers) &&
      supplier.suppliers.length !== 0
    ) {
      // console.log('supplier.suppliers', supplier.suppliers);
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
    // console.log(displayName);

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
        <form onSubmit={this.props.handleOnSubmit}>
          <CreatableSelectInputHorizontal
            label="Supplier Name"
            name="type"
            placeholder="Type supplier name.."
            value={selectedValue && selectedValue}
            options={options}
            getSelectedValue={this.props.getSelectedValue}
            error={errors.type && errors.type}
          />
          <TextInputHorizontal
            label="Supplier Packet Cost"
            value={iPacketCost}
            name="profilePacketCost"
            labelClass="smallTextField"
            onChange={this.props.handleSupplierNumberChange}
            error={errors && errors.packetCost}
          />
          <TextInputHorizontal
            label="Supplier Packet Grams"
            value={iPacketGrams}
            name="profilePacketGrams"
            labelClass="smallTextField"
            onChange={this.props.handleSupplierNumberChange}
            error={errors && errors.packetGrams}
          />
          <ToggleInputHorizontal
            label="Is this your preferred supplier?"
            name="preferred"
            onChange={this.props.toggleChange}
            toggleOn="Preferred"
            checked={preferred}
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
  toggleChange: PropTypes.func.isRequired,
  updateSelectedSupplierState: PropTypes.func.isRequired
};

const actions = {
  updateSelectedSupplierState
};

const mapState = state => ({
  ingredient: state.ingredient,
  supplier: state.supplier,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(SupplierForm);
