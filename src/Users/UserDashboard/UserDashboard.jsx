import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../UserNavbar/UserNavbar';
import UserHome from '../UserHome/UserHome';
import UserProfile from '../UserProfile/UserProfile';
import UserBookings from '../UserBookings/UserBookings';
import UserQueue from '../UserQueue/UserQueue';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <UserHome />;
      case 'appointments':
        return <UserBookings></UserBookings>;
      case 'serial':
        return <UserQueue></UserQueue>;
      case 'profile':
        return <UserProfile />;
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