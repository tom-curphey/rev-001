import React from 'react';
import MainMenu from './MainMenu';
import DeviceMenu from './DeviceMenu';
import DeviceSubMenu from './DeviceSubMenu';
import AddSupplierModal from '../../private/supplier/AddSupplierModal';
// import { Link } from 'react-router-dom';

const AdminMenu = props => {
  return (
    <section className="app">
      <DeviceMenu />
      <div className="kalindi">
        <DeviceSubMenu />
        <AddSupplierModal />
        <div id="screen">
          <main id="main">
            <MainMenu />
            <section className="screenData">{props.children}</section>
          </main>
        </div>
      </div>
    </section>
  );
};

export default AdminMenu;
