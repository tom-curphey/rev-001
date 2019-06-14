import React from 'react';
import AuthMenu from '../../layout/menu/AuthMenu';
import AccountMenu from '../../layout/menu/AccountMenu';

const ProfileSettings = () => {
  return (
    <AuthMenu>
      <AccountMenu />
      <div className="settings profile">Profile Settings</div>
    </AuthMenu>
  );
};

export default ProfileSettings;
