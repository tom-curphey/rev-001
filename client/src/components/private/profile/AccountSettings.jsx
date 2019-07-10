import React from 'react';
import { withRouter } from 'react-router';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Venues from '../venue/Venues';
import VenueForm from '../venue/VenueForm';
import NewComponent from '../../public/NewComponent';

const AccountSettings = ({ match }) => {
  const { account_section, venue_action } = match.params;
  let formContent;

  switch (account_section) {
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
    case 'profile':
      formContent = <ProfileForm />;
      break;
    case 'notifications':
      formContent = <NewComponent />;
      break;

    case 'password':
      formContent = <PasswordForm />;
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
