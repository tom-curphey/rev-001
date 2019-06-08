import React, { Fragment } from 'react';
import MainMenu from './MainMenu';
import DeviceMenu from './DeviceMenu';
import DeviceSubMenu from './DeviceSubMenu';
// import { Link } from 'react-router-dom';

const AdminMenu = props => {
  return (
    <section className="app">
      <DeviceMenu />
      <div className="kalindi">
        <DeviceSubMenu />
        <div id="screen">
          <main id="main">
            <MainMenu />
            {props.children}
          </main>
        </div>
      </div>
    </section>
  );
};

export default AdminMenu;
