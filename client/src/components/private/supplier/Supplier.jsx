import React, { Component, Fragment } from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import { connect } from 'react-redux';
import { loadSuppliers } from './supplierActions';
import Spinner from '../../layout/Spinner';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/utils';
import SelectSupplier from './SelectSupplier';
import SupplierDetailsForm from './SupplierDetailsForm';

class Supplier extends Component {
  state = {};

  componentDidMount() {
    this.props.loadSuppliers();
  }

  render() {
    const { supplier, errors } = this.props;
    let supplierForm;

    if (supplier && supplier.loading) {
      supplierForm = (
        <div style={{ marginTop: '200px' }}>
          <Spinner width="30px" />
        </div>
      );
    } else {
      console.log('Load supplier');
      if (!isEmpty(supplier.selectedSupplier)) {
        supplierForm = (
          <Fragment>
            <SelectSupplier />
            <SupplierDetailsForm />
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
  loadSuppliers: PropTypes.func.isRequired
};

const mapState = state => ({
  supplier: state.supplier
});

const actions = {
  loadSuppliers
};

export default connect(
  mapState,
  actions
)(Supplier);
