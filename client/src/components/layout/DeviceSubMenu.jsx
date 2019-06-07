import React from 'react';
import { Link } from 'react-router-dom';

const DeviceSubMenu = () => {
  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
  };

  return (
    <div id="mySidenav" className="sidenav">
      <span className="closebtn" onClick={closeNav}>
        &times;
      </span>
      <Link to="!#">Recipes</Link>
      <Link to="!#">Ingredients</Link>
      <Link to="!#">Packaging</Link>
    </div>
  );
};

export default DeviceSubMenu;
