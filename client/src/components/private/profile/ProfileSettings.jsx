import React from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';

const ProfileSettings = () => {
  return (
    <AuthMenu>
      <AccountMenu />
      Profile Settings
    </AuthMenu>
  );
};

export default ProfileSettings;
