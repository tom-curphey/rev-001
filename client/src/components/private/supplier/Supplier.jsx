import React, { Component, Fragment } from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import { connect } from 'react-redux';
import { loadSuppliers, addOrEditSupplier } from './supplierActions';
import Spinner from '../../layout/Spinner';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import SelectSupplier from './SelectSupplier';
import SupplierDetailsForm from './SupplierDetailsForm';

class Supplier extends Component {
  state = {
    selectedSupplier: {
      email: ''
    }
  };

  componentDidMount = () => {
    console.log('mounted');

    if (this.props.supplier.selectedSupplier) {
      console.log(
        'selectSupplier',
        this.props.supplier.selectSupplier
      );
      this.setState({
        selectedSupplier: { email: 'hey' }
      });
    } else {
      this.props.loadSuppliers();
    }
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
        });
      }
    }
  };

  handleChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedSupplier: {
        ...prevState.selectedSupplier,
        [e.target.name]: e.target.value
      }
    }));
    // this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    console.log('hit###', this.state);
    this.props.addOrEditSupplier(this.state.selectedSupplier);
  };

  render() {
    const { supplier, errors } = this.props;
    const { selectedSupplier } = this.state;
    let supplierForm;

    if (supplier && supplier.loading) {
      supplierForm = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      if (!isEmpty(selectedSupplier.supplier)) {
        supplierForm = (
          <Fragment>
            <SelectSupplier />
            <SupplierDetailsForm
              selectedSupplier={selectedSupplier.supplier}
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
        <section className="ingredient">
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
  addOrEditSupplier
};

export default connect(
  mapState,
  actions
)(Supplier);
