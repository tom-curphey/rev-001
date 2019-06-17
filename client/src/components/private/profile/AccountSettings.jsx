import React from 'react';
import { withRouter } from 'react-router';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Venues from '../venue/Venues';

const AccountSettings = ({ match }) => {
  const { account_section } = match.params;
  let formContent;

  switch (account_section) {
    case 'profile':
      formContent = <ProfileForm />;
      break;
    case 'password':
      formContent = <PasswordForm />;
      break;
    case 'venues':
      formContent = <Venues />;
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
