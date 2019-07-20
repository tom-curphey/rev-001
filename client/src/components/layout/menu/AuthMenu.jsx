import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from './MainMenu';
import DeviceMenu from './DeviceMenu';
import DeviceSubMenu from './DeviceSubMenu';
import AddSupplierModal from '../../private/supplier/AddSupplierModal';
import LoadingPage from '../LoadingPage';
import { isEmpty } from '../../../utils/utils';

const AdminMenu = ({ auth, profile, children, history }) => {
  if (!auth.isAuthenticated) {
    return <Redirect to="/signin" />;
  }

  let content;
  if (isEmpty(profile.profile)) {
    if (auth.loading || profile.loading) {
      content = <LoadingPage />;
    } else {
      console.log('ppp', profile);

      if (isEmpty(profile.profile.venues)) {
        console.log('I was touching it');

        return <Redirect to="onboarding" />;
      } else {
        content = (
          <section className="app">
            <DeviceMenu />
            <div className="kalindi">
              <DeviceSubMenu />
              <AddSupplierModal />
              <div id="screen">
                <main id="main">
                  <MainMenu />
                  <section className="screenData">{children}</section>
                </main>
              </div>
            </div>
          </section>
        );
      }
    }
  } else {
    content = (
      <section className="app">
        <DeviceMenu />
        <div className="kalindi">
          <DeviceSubMenu />
          <AddSupplierModal />
          <div id="screen">
            <main id="main">
              <MainMenu />
              <section className="screenData">{children}</section>
            </main>
          </div>
        </div>
      </section>
    );
  }

  return content;
};

const mapState = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapState)(AdminMenu);
