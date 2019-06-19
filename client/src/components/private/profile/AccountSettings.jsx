import React from 'react';
import { withRouter } from 'react-router';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Venues from '../venue/Venues';
import VenueForm from '../venue/VenueForm';

const AccountSettings = ({ match }) => {
  const { account_section, venue_action } = match.params;
  let formContent;

  switch (account_section) {
    case 'profile':
      formContent = <ProfileForm />;
      break;
    case 'password':
      formContent = <PasswordForm />;
      break;
    case 'venues':
      if (venue_action) {
        if (venue_action === 'add') {
          formContent = <VenueForm />;
        }
        if (venue_action === 'edit') {
          formContent = <VenueForm />;
        }
      } else {
        formContent = <Venues />;
      }

      break;

    default:
      formContent = '';
      break;
  }

  return (
    <AuthMenu>
      <AccountMenu />
      {formContent}
    </AuthMenu>
  );
};

export default withRouter(AccountSettings);
