import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const DeviceMenu = () => {
  const handleToggleClick = e => {
    const toggle = document.getElementById('toggle');
    const toggleActive = toggle.classList.contains('active');
    if (toggleActive === true) {
      toggle.classList.remove('active');
    } else {
      toggle.classList += ' active';
    }
  };

  return (
    <Fragment>
      <section className="deviceMenu">
        <nav className="venueButton">
          <div>Icon</div>
          <div>By Kalindi</div>
          <div>></div>
        </nav>
        <nav className="toggle" onClick={handleToggleClick}>
          <span>=</span>
        </nav>
      </section>
      <section id="toggle" className="deviceToggleMenu">
        <nav className="menu">
          <Link className="menuItem" to="!#">
            <i />
            <span>Recipes</span>
          </Link>
          <Link className="menuItem" to="!#">
            <i />
            <span>Ingredients</span>
          </Link>
          <Link className="menuItem" to="!#">
            <i />
            <span>Packaging</span>
          </Link>
        </nav>
        <nav className="subMenu">
          <Link className="menuItem" to="!#">
            Settings
          </Link>
          <Link className="menuItem" to="!#">
            Ask For Help
          </Link>
        </nav>
      </section>
    </Fragment>
  );
};

export default DeviceMenu;
