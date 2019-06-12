import React from 'react';

const MainVenueMenu = () => {
  return (
    <nav className="mainVenueMenu">
      <ul className="venueMenuHeader">
        <li>Image</li>
        <li>Recipe Revenue Account</li>
        <li>X</li>
      </ul>
      <ul className="venueMenuList">
        <li>By Kalindi</li>
        <li>Beach house</li>
        <li>Personal</li>
        <li>+ Add Venue</li>
      </ul>
      <hr />
      <ul>
        <li>
          You are signed in as <span>mail@bykalindi.com</span>
        </li>
        <li>Manage your profile</li>
        <li>Sign out</li>
      </ul>
      <ul>
        <li>Terms - Privacy</li>
      </ul>
    </nav>
  );
};

export default MainVenueMenu;
