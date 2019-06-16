import React, { Fragment } from 'react';
import { withRouter } from 'react-router';

function AccountMenu({ match }) {
  let selected = match.params.account_section;
  console.log('account_section:', selected);

  return (
    <section className="accountMenu">
      <h3>Profile</h3>
      <ul>
        <li>Venues</li>
        <li className={selected === 'profile' ? 'selected' : ''}>
          Personal Information
        </li>
        <li>Email Notifications</li>
        <li>Change Password</li>
      </ul>
    </section>
  );
}

export default withRouter(AccountMenu);
