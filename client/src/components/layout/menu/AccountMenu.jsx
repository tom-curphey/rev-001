import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

function AccountMenu({ match }) {
  let selected = match.params.account_section;
  // console.log('account_section:', selected);

  return (
    <section className="accountMenu">
      <h3>Profile</h3>
      <ul>
        <li className={selected === 'venues' ? 'selected' : ''}>
          <Link to="/account/venues">Venues</Link>
        </li>
        <li className={selected === 'profile' ? 'selected' : ''}>
          <Link to="/account/profile">Personal Information</Link>
        </li>
        <li
          className={selected === 'notifications' ? 'selected' : ''}
        >
          <Link to="/account/notifications">Email Notifications</Link>
        </li>
        <li className={selected === 'password' ? 'selected' : ''}>
          <Link to="/account/password">Change Password</Link>
        </li>
      </ul>
    </section>
  );
}

export default withRouter(AccountMenu);
