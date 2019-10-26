import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatableSelectInputBorder from '../../layout/input/CreatableSelectInputBorder';
import {
  removePreferredSupplier,
  removeSelectedSupplier,
  setSelectedSupplier,
  getSelectedSupplier
} from '../supplier/supplierActions';
import { isEmpty, capitalizeFirstLetter } from '../../../utils/utils';

class SelectSupplier extends Component {
  state = {
    selectedValue: {
      label: 'Type supplier name to start..',
      value: 'no-supplierselected'
    }
  };

  componentDidMount() {
    if (!isEmpty(this.props.supplier.selectedSupplier)) {
      const { supplier } = this.props.supplier.selectedSupplier;
      let selectedValue = {};
      selectedValue.label = supplier.displayName;
      if (!supplier._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = supplier._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      supplier: { selectedSupplier },
      errors
    } = this.props;
    // If selected ingredient changes update local state with selected ingredient
    if (prevProps.supplier.selectedSupplier !== selectedSupplier) {
      console.log('Selected Supplier', selectedSupplier.supplier);
      let selectedValue = {
        label: selectedSupplier.supplier.displayName
      };
      if (!selectedSupplier.supplier._id) {
        selectedValue.value = 'new';
      } else {
        selectedValue.value = selectedSupplier.supplier._id;
      }
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentWillUnmount() {
    console.log('SELECT Supplier UNMOUNTED');
  }

  getSelectedValue = selectedValue => {
    // let addSupplier = false;
    let selectedSupplier = [];
    if (selectedValue.__isNew__) {
      // @todo
      this.props.removeSelectedSupplier();
      this.props.removeSelectedSupplier();
      // addSupplier = true;
      const newSupplier = {
        displayName: capitalizeFirstLetter(selectedValue.label),
        __isNew__: true
      };
      selectedSupplier.push(newSupplier);
    } else {
      if (this.props.supplier.suppliers !== null) {
        selectedSupplier = this.props.supplier.suppliers.filter(
          supplier => {
            return supplier._id === selectedValue.value;
          }
        );
      }
    }

    if (!isEmpty(selectedSupplier)) {
      // this.props.removePreferredSupplier();
      this.props.getSelectedSupplier(
        selectedSupplier[0],
        this.props.supplier.suppliers
      );
    }
  };

  render() {
    const { suppliers } = this.props.supplier;
    const { selectedValue } = this.state;

    let formContent;

    if (suppliers !== null) {
      const options = suppliers.map(supplier => {
        let selectData = {};
        selectData.label = supplier.displayName;
        selectData.value = supplier._id;
        return selectData;
      });
      formContent = (
        <CreatableSelectInputBorder
          value={selectedValue}
          name="supplier"
          options={options}
          getSelectedValue={this.getSelectedValue}
          placeholder="Type supplier name to select supplier.."
          createLabel="+ Add supplier"
          largeSelect={true}
        />
      );
    } else {
      formContent = (
        <CreatableSelectInputBorder
          value={selectedValue}
          name="supplier"
          getSelectedValue={this.getSelectedValue}
          placeholder="Type supplier name to select supplier.."
          createLabel="+ Add supplier"
          largeSelect={true}
        />
      );
    }
    return (
      <React.Fragment>{formContent && formContent}</React.Fragment>
    );
  }
}

SelectSupplier.propTypes = {
  supplier: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  setSelectedSupplier: PropTypes.func.isRequired,
  getSelectedSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired,
  removePreferredSupplier: PropTypes.func.isRequired,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  setSelectedSupplier,
  getSelectedSupplier,
  removeSelectedSupplier,
  removePreferredSupplier,
  removeSelectedSupplier
};

const mapState = state => ({
  supplier: state.supplier,
  profile: state.profile
});

export default connect(
  mapState,
  actions
)(SelectSupplier);
