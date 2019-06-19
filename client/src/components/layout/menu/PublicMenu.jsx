import React from 'react';
import DeviceSubMenu from './DeviceSubMenu';
// import { Link } from 'react-router-dom';

const Public = props => {
  return (
    <section className="app public">
      <div className="kalindi">
        <DeviceSubMenu />
        <div id="screen">
          <main id="main">{props.children}</main>
        </div>
      </div>
    </section>
  );
};

export default Public;
