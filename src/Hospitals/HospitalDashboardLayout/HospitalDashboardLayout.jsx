import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Stethoscope, Layers, CalendarCheck, Users, ClipboardList, ShieldAlert, ArrowLeftRight } from 'lucide-react';
import HospitalNavbar from '../HospitalNavbar/HospitalNavbar';

const HospitalDashboardLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Hospital Profile', path: '/hospital_admin_dashboard/profile', icon: Building },
    { name: 'Doctors', path: '/hospital_admin_dashboard/doctors', icon: Stethoscope },
    { name: 'Manage Tests', path: '/hospital_admin_dashboard/manageTests', icon: Layers },
    { name: 'Appointments', path: '/hospital_admin_dashboard/appointments', icon: CalendarCheck },
    { name: 'Queue Management', path: '/hospital_admin_dashboard/queue', icon: ArrowLeftRight },
    { name: 'Assistants', path: '/hospital_admin_dashboard/manageAssistants', icon: Users },
    { name: 'Reports', path: '/hospital_dashboard/reports', icon: ClipboardList },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-50/50">
      <input id="hospital-sidebar" type="checkbox" className="drawer-toggle" />
      
      {/* Page Content Wrapper */}
      <div className="drawer-content flex flex-col">
        <HospitalNavbar />
        <main className="p-6 sm:p-8 flex-1">
          <Outlet /> {/* এখানে ড্যাশবোর্ডের সাব-পেজগুলো (যেমন: HospitalHome) লোড হবে */}
        </main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-50">
        <label htmlFor="hospital-sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-72 min-h-full bg-white border-r border-gray-100 text-gray-700 flex flex-col justify-between">
          
          <div>
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-gray-50">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">DocLine <span className="text-blue-600 font-medium text-xs">HOSPITAL</span></span>
            </div>

            {/* Nav Links */}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer Card */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-6">
            <h4 className="text-xs font-bold text-gray-700 mb-1">Need Assistance?</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Contact DocLine super admin support for technical issues.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HospitalDashboardLayout;