import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PublicMenu from '../../layout/menu/PublicMenu';

const Landing = props => {
  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginRight = '250px';
  };
  return (
    <PublicMenu>
      <nav className="toggle publicMenu" onClick={openNav}>
        <span>&#9776;</span>
      </nav>
      <div>Landing</div>
    </PublicMenu>
  );
};

Landing.propTypes = {};

export default Landing;
