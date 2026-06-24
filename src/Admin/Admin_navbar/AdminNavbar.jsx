import React from 'react';
import { NavLink } from 'react-router';
import { Users, Building2, PlusCircle, ShieldAlert } from 'lucide-react';

const AdminNavbar = () => {
  // সাইডবার মেনু আইটেমসমূহ
  const menuItems = [
    { label: 'ম্যানেজ ইউজার', icon: Users, href: '/admin_dashboard/manageUsers' },
    { label: 'হাসপাতাল যুক্ত করুন', icon: PlusCircle, href: '/admin_dashboard/addHospital' },
    { label: 'হাসপাতাল ম্যানেজ', icon: Building2, href: '/admin_dashboard/manageHospitals' },
    { label: 'ক্লিনিক যুক্ত করুন', icon: PlusCircle, href: '/admin_dashboard/addClinic' },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col sticky top-0">
      {/* এডমিন হেডার ব্র্যান্ডিং */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg leading-tight">এডমিন প্যানেল</h2>
          <p className="text-xs font-medium text-blue-600">DocLine Control Suite</p>
        </div>
      </div>

      {/* নেভিগেশন লিঙ্কসমূহ */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-[15px] transition-all duration-200
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNavbar;