import React from 'react';
import ApiSettings from '../components/settings/ApiSettings';
import UserProfile from '../components/settings/UserProfile';

const SettingsPage = () => {
    return (
        <div className="settings-page">
            <h1>Settings</h1>
            <ApiSettings />
            <UserProfile />
        </div>
    );
};

export default SettingsPage;