import React from 'react';
import { Link } from 'react-router-dom';

const MainMenu = () => {
  return (
    <section className="mainMenu">
      <nav className="venueButton">
        <div>Icon</div>
        <div>By Kalindi</div>
        <div>></div>
      </nav>
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
  );
};

export default MainMenu;
