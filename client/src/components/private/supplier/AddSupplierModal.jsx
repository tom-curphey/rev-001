import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputHorizontal from '../../layout/input/TextInputHorizontal';
import TextInput from '../../layout/input/TextInput';
import {
  addOrEditSupplier,
  removeSelectedSupplier
} from './supplierActions';

class AddSupplierModal extends Component {
  state = {
    showModal: false,
    displayName: '',
    email: '',
    phone: '',
    address: '',
    website: ''
  };

  componentDidMount() {
    if (
      this.props.selectedSupplier &&
      this.props.supplier.selectedSupplier._id
    ) {
      console.log('true');
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedSupplier !== this.props.selectedSupplier &&
      this.props.selectedSupplier
    ) {
      if (this.props.selectedSupplier._id) {
        this.setState({
          showModal: false
        });
      } else {
        console.log('true', this.props.selectedSupplier);

        const {
          displayName,
          email,
          phone,
          address,
          website
        } = this.props.selectedSupplier;

        this.setState({
          showModal: true,
          displayName: displayName,
          email: email,
          phone: phone,
          address: address,
          website: website
        });
      }
    }

    if (
      prevProps.selectedSupplier !== this.props.selectedSupplier &&
      !this.props.selectedSupplier
    ) {
      this.setState({
        showModal: false
      });
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleNumberChange = e => {
    const { name, value } = e.target;
    if (!isNaN(value) || value === '') {
      this.setState({
        [name]: value
      });
    }
  };

  handleOnSubmit = e => {
    e.preventDefault();
    console.log('SUBMIT');
    const {
      displayName,
      email,
      phone,
      address,
      website
    } = this.state;

    const newSupplier = {
      displayName,
      email,
      phone,
      address,
      website
    };

    this.props.addOrEditSupplier(newSupplier);
  };

  handleFormCancel = () => {
    this.props.removeSelectedSupplier();
  };

  render() {
    const {
      showModal,
      displayName,
      email,
      phone,
      address,
      website
    } = this.state;
    const { errors } = this.props;

    let modalContent;
    if (showModal) {
      modalContent = (
        <section className="modalScreen addSupplierModal">
          <div className="modal">
            <span className="close" onClick={this.handleFormCancel}>
              X
            </span>
            <h2>Add Ingredient Supplier</h2>
            <p>For Chickpeas</p>
            <form onSubmit={this.handleOnSubmit}>
              <TextInput
                label="Supplier Name"
                value={displayName}
                name="displayName"
                onChange={this.handleChange}
                error={errors.displayName && errors.displayName}
              />
              <TextInputHorizontal
                label="Email"
                value={email}
                name="email"
                onChange={this.handleChange}
                error={errors.email && errors.email}
              />
              <TextInputHorizontal
                label="Phone"
                value={phone}
                name="phone"
                onChange={this.handleNumberChange}
                error={errors.phone && errors.phone}
              />
              <TextInputHorizontal
                label="Address"
                value={address}
                name="address"
                onChange={this.handleChange}
                error={errors.address && errors.address}
              />
              <TextInputHorizontal
                label="Website"
                value={website}
                name="website"
                onChange={this.handleChange}
                error={errors.website && errors.website}
              />
              <div className="button">
                <div className="twoButtons">
                  <button
                    type="button"
                    className="cancel"
                    onClick={this.handleFormCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="orange">
                    Save New Supplier
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      );
    } else {
      modalContent = <Fragment />;
    }

    return <Fragment>{modalContent}</Fragment>;
  }
}

AddSupplierModal.propTypes = {
  selectedSupplier: PropTypes.object,
  errors: PropTypes.object,
  removeSelectedSupplier: PropTypes.func.isRequired
};

const actions = {
  addOrEditSupplier,
  removeSelectedSupplier
};

const mapState = state => ({
  selectedSupplier: state.supplier.selectedSupplier,
  errors: state.errors
});

export default connect(
  mapState,
  actions
)(AddSupplierModal);
