import React from 'react';
import { Link } from 'react-router-dom';

const DeviceSubMenu = () => {
  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
  };

  return (
    <div id="mySidenav" className="sidenav">
      <a
        href="javascript:void(0)"
        className="closebtn"
        onClick={closeNav}
      >
        &times;
      </a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>
  );
};

export default DeviceSubMenu;
