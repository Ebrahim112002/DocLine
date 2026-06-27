import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../UserNavbar/UserNavbar';
import UserHome from '../UserHome/UserHome';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <UserHome />;
      case 'appointments':
        return <div className="p-8 text-2xl font-semibold text-gray-700">My Appointments Coming Soon...</div>;
      case 'serial':
        return <div className="p-8 text-2xl font-semibold text-gray-700">My Serial Numbers Coming Soon...</div>;
      case 'profile':
        return <div className="p-8 text-2xl font-semibold text-gray-700">Profile Settings Coming Soon...</div>;
      default:
        return <UserHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navbar */}
      <UserNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;