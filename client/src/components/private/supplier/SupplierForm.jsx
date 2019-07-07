import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSelectedSupplierState } from './supplierActions';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import ToggleInputHorizontal from '../../layout/input/ToggleInputHorizontal';
import CreatableSelectInputHorizontal from '../../layout/input/CreatableSelectInputHorizontal';
// import SelectInputHorizontal from '../../layout/input/SelectInputHorizontal';
// import Spinner from '../../layout/Spinner';
import { isEmpty, roundNumberAsString } from '../../../utils/utils';

class SupplierForm extends Component {
  state = {
    selectedSupplier: {
      supplier: {
        _id: '',
        displayName: ''
      },
      packetCost: '',
      packetGrams: '',
      profilePacketCost: null,
      profilePacketGrams: null,
      preferred: false
    },
    readyToSave: false
  };

  // componentDidMount() {
  //   const { ingredient, supplier } = this.props;
  //   if (
  //     !isEmpty(ingredient.selectedIngredient) &&
  //     !isEmpty(supplier.selectedSupplier)
  //   ) {
  //     const slSupplier = supplier.suppliers.filter(sls => {
  //       return sls._id === supplier.selectedSupplier.supplier._id;
  //     });

  //     if (!isEmpty(slSupplier)) {
  //       console.log('slSupplier', slSupplier);
  //       const usiSupplier = {
  //         ...supplier.selectedSupplier,
  //         supplier: {
  //           ...supplier.selectedSupplier.supplier,
  //           address: '1 Apple odds road',
  //           confirmedDetails: false,
  //           email: 'mail@appleodds.com',
  //           phone: '98623842',
  //           urlName: 'apple-odds',
  //           website: 'www.appleodds.com'
  //         }
  //       };
  //       this.props.updateSelectedSupplierState(usiSupplier);
  //     }
  //   }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const { supplier } = this.props;

  //   if (
  //     prevProps.supplier.selectedSupplier !==
  //     supplier.selectedSupplier
  //   ) {
  //     console.log(
  //       'prevProps.supplier.selectedSupplier.supplier._id',
  //       prevProps.supplier.selectedSupplier.supplier._id
  //     );
  //     console.log(
  //       'supplier.selectedSupplier.supplier._id',
  //       supplier.selectedSupplier.supplier._id
  //     );

  //     this.setState({
  //       selectedSupplier: supplier.selectedSupplier
  //     });
  //   }

  //   if (prevState.selectedSupplier !== this.state.selectedSupplier) {
  //     this.checkReadyToSave();
  //   }
  // }

  // handleSupplierChange = e => {
  //   e.persist();
  //   let value = e.target.value;
  //   this.setState(prevState => ({
  //     selectedSupplier: {
  //       ...prevState.selectedSupplier,
  //       [e.target.name]: value
  //     }
  //   }));
  // };

  // handleSupplierNumberChange = e => {
  //   e.persist();
  //   let value = e.target.value;
  //   if (!isNaN(value) || value === '') {
  //     this.setState(prevState => ({
  //       selectedSupplier: {
  //         ...prevState.selectedSupplier,
  //         [e.target.name]: value
  //       }
  //     }));
  //   }
  // };

  // handleToggleChange = e => {
  //   const { selectedSupplier } = this.state;
  //   console.log('Toggle Change', selectedSupplier);
  // };

  // checkReadyToSave = () => {
  //   const {
  //     selectedSupplier: {
  //       supplier,
  //       profilePacketCost,
  //       profilePacketGrams
  //     }
  //   } = this.state;

  //   // console.log('RTS: selectedSupplier', this.state.selectedSupplier);

  //   if (
  //     !isEmpty(supplier._id) &&
  //     !isEmpty(profilePacketCost) &&
  //     !isEmpty(profilePacketGrams)
  //   ) {
  //     this.setState({ readyToSave: true });
  //   } else {
  //     this.setState({ readyToSave: false });
  //   }
  // };

  // handleSubmit = () => {
  //   // console.log('STATE:', this.state);
  //   const {
  //     selectedIngredient,
  //     selectedSupplier,
  //     readyToSave
  //   } = this.state;

  //   if (readyToSave) {
  //     const ingredientData = {};
  //     ingredientData.metrics = {};

  //     if (selectedIngredient._id) {
  //       console.log('Edit ingredient');
  //       ingredientData._id = selectedIngredient._id;
  //       ingredientData.displayName = selectedIngredient.displayName;
  //       if (!isEmpty(selectedIngredient.metrics.cup))
  //         ingredientData.metrics.cup = selectedIngredient.metrics.cup;
  //       if (!isEmpty(selectedIngredient.metrics.whole))
  //         ingredientData.metrics.whole =
  //           selectedIngredient.metrics.whole;
  //     } else {
  //       console.log('Add new ingredient');
  //       ingredientData.displayName = selectedIngredient.displayName;
  //       if (!isEmpty(selectedIngredient.metrics.cup))
  //         ingredientData.metrics.cup = selectedIngredient.metrics.cup;
  //       if (!isEmpty(selectedIngredient.metrics.whole))
  //         ingredientData.metrics.whole =
  //           selectedIngredient.metrics.whole;
  //     }

  //     const {
  //       supplier: { _id },
  //       preferred,
  //       profilePacketGrams,
  //       profilePacketCost,
  //       packetCost,
  //       packetGrams
  //     } = selectedSupplier;

  //     const supplierData = {};
  //     supplierData._id = _id;
  //     supplierData.preferred = preferred;
  //     supplierData.packetGrams = profilePacketGrams
  //       ? profilePacketGrams
  //       : packetGrams;
  //     supplierData.packetCost = profilePacketCost
  //       ? profilePacketCost
  //       : packetCost;
  //     // console.log('supplierData', supplierData);

  //     this.props.addOrEditIngredientAndSupplier(
  //       ingredientData,
  //       supplierData
  //     );
  //   }
  // };

  render() {
    const { supplier, getSelectedValue, errors } = this.props;

    const {
      selectedSupplier: {
        supplier: { _id, displayName },
        packetCost,
        packetGrams,
        profilePacketCost,
        profilePacketGrams,
        preferred
      }
    } = this.props;

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
        <form onSubmit={this.handleOnSubmit}>
          <CreatableSelectInputHorizontal
            label="Supplier Name"
            name="type"
            placeholder="Type supplier name.."
            value={selectedValue && selectedValue}
            options={options}
            getSelectedValue={getSelectedValue}
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
