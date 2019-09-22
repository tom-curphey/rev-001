import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthMenu from '../../layout/menu/AuthMenu';
import Spinner from '../../layout/Spinner';
import TextInput from '../../layout/input/TextInput';
import {
  loadSuppliers,
  setPreferredSupplier,
  updateSelectedSupplierState,
  getSelectedSupplier,
  updatePreferredSupplier,
  removeSelectedSupplier,
  removePreferredSupplier
} from '../supplier/supplierActions';
import { isEmpty } from '../../../utils/utils';
import editIcon from '../../../images/edit.svg';
import SelectSupplier from './SelectSupplier';

class Supplier extends Component {
  state = {
    selectedSupplier: {
      supplier: {
        _id: '',
        displayName: ''
      },
      packetCost: '',
      packetGrams: '',
      profilePacketCost: '',
      profilePacketGrams: '',
      preferred: false
    },
    readyToSave: false,
    displaySupplierNameForm: false,
    selectedSupplierChanged: false
  };

  componentDidMount() {
    this.props.loadSuppliers();
    const { supplier } = this.props;

    if (!isEmpty(supplier.selectedSupplier)) {
      if (isEmpty(supplier.selectedSupplier.displayName)) {
        this.setState({
          displaySupplierNameForm: true,
          selectedSupplier: supplier.Selectedsupplier
        });
      } else {
        this.setState({
          selectedSupplier: supplier.selectedSupplier
        });
      }
    }

    if (
      !isEmpty(supplier.selectedSupplier) &&
      !isEmpty(supplier.suppliers)
    ) {
      setPreferredSupplier(supplier.selectedSupplier.supplier._id);

      const slSupplier = supplier.suppliers.filter(sls => {
        return sls._id === supplier.selectedSupplier.supplier._id;
      });

      if (!isEmpty(slSupplier)) {
        const usiSupplier = {
          ...supplier.selectedSupplier,
          supplier: {
            ...supplier.selectedSupplier.supplier,
            address: slSupplier[0].address,
            confirmedDetails: slSupplier[0].confirmedDetails,
            email: slSupplier[0].email,
            phone: slSupplier[0].phone,
            urlName: slSupplier[0].urlName,
            website: slSupplier[0].website
          }
        };
        this.props.updateSelectedSupplierState(usiSupplier);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { supplier, errors } = this.props;
    const {
      selectedSupplier,
      displaySupplierNameForm,
      selectedSupplierChanged
    } = this.state;
    if (isEmpty(supplier.suppliers)) {
      this.props.loadSuppliers();
    }

    // If selected ingredient changes update local state with selected ingredient
    if (
      prevProps.supplier.selectedSupplier !==
      supplier.selectedSupplier
    ) {
      if (isEmpty(errors)) {
        this.setState({
          selectedSupplier: supplier.selectedSupplier,
          displaySupplierNameForm: false,
          selectedSupplierChanged: true
        });
      }
    }
  }

  render() {
    const { supplier, errors } = this.props;
    const {
      selectedSupplier,
      readyToSave,
      displaySupplierNameForm
    } = this.state;

    let supplierForm = 'gere';
    if (supplier && supplier.loading) {
      supplierForm = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (!isEmpty(supplier.selectedSupplier)) {
        supplierForm = (
          <Fragment>
            <div id="supplierTextBox" className="editSupplierName">
              {displaySupplierNameForm ? (
                <Fragment>
                  <form>
                    <TextInput
                      label="Supplier Name"
                      value={selectedSupplier.displayName}
                      name="displayName"
                      onChange={this.handleSupplierNameChange}
                      onBlur={this.updateSupplierName}
                      type="text"
                      error={errors.displayName && errors.displayName}
                      autoFocus={true}
                      onKeyDown={this.handleEnterKeyDown}
                    />
                  </form>
                </Fragment>
              ) : (
                <Fragment>
                  <SelectSupplier />
                  <div
                    className="supplierNameEditIcon"
                    onClick={this.displayEditSupplierNameForm}
                  >
                    <img
                      src={editIcon}
                      alt="Edit icon to represent the changing the Supplier name"

                      // onMouseOver={this.onChangeRecipeHover}
                      // onMouseOut={this.onChangeRecipeHover}
                    />
                  </div>
                </Fragment>
              )}
              {errors.supplier && (
                <span className="errorMsg">{errors.supplier}</span>
              )}
            </div>
          </Fragment>
        );
      } else {
        supplierForm = <SelectSupplier />;
      }
    }

    return (
      <AuthMenu>
        <section className="supplier">
          <div>
            <h1>Supplier</h1>
            <h3>Search / Create / Edit</h3>
            {supplierForm}
          </div>
        </section>
      </AuthMenu>
    );
  }
}

Supplier.propTypes = {
  supplier: PropTypes.object.isRequired
};

const mapState = state => ({
  supplier: state.supplier,
  profile: state.profile,
  errors: state.errors
});

const actions = {
  loadSuppliers
};

export default connect(
  mapState,
  actions
)(Supplier);
