import React, { Fragment } from 'react';

const DeviceMenu = () => {
  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginRight = '250px';
  };
  return (
    <Fragment>
      <section className="deviceMenu">
        <nav className="venueButton">
          <div>Icon</div>
          <div>By Kalindi</div>
          <div>></div>
        </nav>
        <nav className="toggle" onClick={openNav}>
          <span>&#9776;</span>
        </nav>
      </section>
    </Fragment>
  );
};

export default DeviceMenu;
