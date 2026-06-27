import React from 'react';
import { User, Calendar, Hash, Home, LogOut } from 'lucide-react';

const UserNavbar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'serial', label: 'My Serial Number', icon: Hash },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col shadow-xl">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DocLine</h1>
            <p className="text-xs text-gray-500">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-8">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all font-medium ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserNavbar;