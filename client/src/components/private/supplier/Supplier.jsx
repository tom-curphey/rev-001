import React, { Component, Fragment } from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import { connect } from 'react-redux';
import {
  loadSuppliers,
  addOrEditSupplier,
  updateReduxSupplierState
} from './supplierActions';
import { removeErrors, setErrors } from '../../../redux/errorActions';
import Spinner from '../../layout/Spinner';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import SelectSupplier from './SelectSupplier';
import SupplierDetailsForm from './SupplierDetailsForm';
import editIcon from '../../../images/edit.svg';
import TextInput from '../../layout/input/TextInput';

class Supplier extends Component {
  state = {
    selectedSupplier: {},
    displaySupplierNameForm: false
  };

  componentDidMount = () => {
    console.log('mounted', this.props.supplier);
    this.props.loadSuppliers();
    // }
  };

  componentDidUpdate = prevProps => {
    if (
      prevProps.supplier.selectedSupplier !==
      this.props.supplier.selectedSupplier
    ) {
      if (
        this.props.supplier &&
        this.props.supplier.selectedSupplier
      ) {
        this.setState({
          selectedSupplier: this.props.supplier.selectedSupplier
            .supplier,
          displaySupplierNameForm: false
        });
        const textbox = document.getElementById('supplierTextBox');
        if (textbox) {
          textbox.classList.remove('editSupplierNameTextBox');
        }
      }
    }

    if (prevProps.errors !== this.props.errors) {
      if (this.props.errors.supplier) {
        this.setState({
          displaySupplierNameForm: true
        });
        const textbox = document.getElementById('supplierTextBox');

        if (textbox) {
          textbox.classList.add('editSupplierNameTextBox');
        }
      } else {
        this.setState({
          displaySupplierNameForm: false
        });
        const textbox = document.getElementById('supplierTextBox');
        if (textbox) {
          textbox.classList.remove('editSupplierNameTextBox');
        }
      }
    }
  };

  displayEditSupplierNameForm = () => {
    this.setState({
      displaySupplierNameForm: true
    });

    document
      .getElementById('supplierTextBox')
      .classList.add('editSupplierNameTextBox');
  };

  updateSupplierName = () => {
    if (isEmpty(this.state.selectedSupplier.displayName)) {
      this.props.setErrors({
        displayName: 'Supplier name is required'
      });
    } else {
      this.props.updateReduxSupplierState(
        this.state.selectedSupplier
      );
      // this.props.removeErrors();
    }
    // if (this.state.readyToSave) {
    this.handleSubmit();
    // }
  };

  handleChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedSupplier: {
        ...prevState.selectedSupplier,
        [e.target.name]: e.target.value
      }
    }));

    if (!isEmpty(this.props.errors)) {
      console.log('#### HELLO', this.props.errors);
      // this.props.removeErrors();
    }
  };

  handleSubmit = () => {
    this.props.removeErrors();
    this.props.addOrEditSupplier(this.state.selectedSupplier);
  };

  render() {
    const { supplier, errors } = this.props;
    const { selectedSupplier, displaySupplierNameForm } = this.state;
    let supplierForm;

    console.log('displaySupplierNameForm', displaySupplierNameForm);

    if (supplier && supplier.loading) {
      supplierForm = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      const selectSupplierForm = (
        <div
          ref={this.supplierTextBox}
          id="supplierTextBox"
          className="editSupplierName"
        >
          {displaySupplierNameForm ? (
            <form>
              <TextInput
                label="Supplier Name"
                value={selectedSupplier.displayName}
                name="displayName"
                onChange={this.handleChange}
                onBlur={this.updateSupplierName}
                type="text"
                error={errors.displayName && errors.displayName}
                autoFocus={true}
                onKeyDown={this.handleEnterKeyDown}
              />
            </form>
          ) : (
            <Fragment>
              <SelectSupplier />
              <div
                className="supplierNameEditIcon"
                onClick={this.displayEditSupplierNameForm}
              >
                <img
                  src={editIcon}
                  alt="Edit icon to represent the changing the supplier name"
                />
              </div>
            </Fragment>
          )}
          {errors.supplier && (
            <span className="errorMsg">{errors.supplier}</span>
          )}
        </div>
      );

      if (!isEmpty(selectedSupplier)) {
        supplierForm = (
          <Fragment>
            {selectSupplierForm}
            <SupplierDetailsForm
              selectedSupplier={selectedSupplier}
              errors={errors}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
            />
          </Fragment>
        );
      } else {
        supplierForm = <SelectSupplier />;
      }
    }

    return (
      <AuthMenu>
        <section className="ingredient supplier">
          <div>
            <h1>Suppliers</h1>
            <h3>Search / Create / Edit</h3>
            {supplierForm}
          </div>
          {/* @todo would it be worth showing an overview of the supplier in a panel here for example show the ingredients & map of suppliers ditribution locations? */}
        </section>
      </AuthMenu>
    );
  }
}

Supplier.propTypes = {
  supplier: PropTypes.object.isRequired,
  loadSuppliers: PropTypes.func.isRequired,
  addOrEditSupplier: PropTypes.func.isRequired
};

const mapState = state => ({
  supplier: state.supplier,
  errors: state.errors
});

const actions = {
  loadSuppliers,
  addOrEditSupplier,
  setErrors,
  removeErrors,
  updateReduxSupplierState
};

export default connect(
  mapState,
  actions
)(Supplier);
