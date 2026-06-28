import React, { useContext } from 'react';
import { Bell, LogOut, UserCircle } from 'lucide-react';
import { AuthContext } from '../../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router';


const HospitalNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="navbar bg-white border-b border-gray-100 px-6 justify-between sticky top-0 z-50">
      {/* Left: Mobile Toggle Input Link Placeholder */}
      <NavLink to='/'>
         <div className="flex-none lg:hidden">
        <label htmlFor="hospital-sidebar" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div>
      </NavLink>
     

      {/* Center/Left Title */}
      <div className="flex-1 flex items-center gap-4">
         
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
          Hospital Admin Panel
        </span>
       
      </div>
     
      

      {/* Right: Actions */}
      <div className="flex-none gap-4">
        {/* Notifications */}
        <button className="btn btn-ghost btn-circle text-gray-500 hover:bg-gray-50">
          <div className="indicator">
            <Bell className="w-5 h-5" />
            <span className="badge badge-sm badge-primary indicator-item">3</span>
          </div>
        </button>

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-gray-200">
            <div className="w-10 rounded-full bg-gray-100 flex items-center justify-center">
              {user?.photoURL ? <img src={user.photoURL} alt="Admin" /> : <UserCircle className="w-8 h-8 text-gray-400 m-1" />}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-2xl w-56 border border-gray-100">
            <li className="px-4 py-2 border-b border-gray-50">
              <p className="font-bold text-gray-900 block truncate">{user?.displayName || "Admin User"}</p>
              <p className="text-xs text-gray-400 block truncate">{user?.email}</p>
            </li>
            <li className="mt-1">
              <button onClick={logout} className="text-red-600 hover:bg-red-50 font-semibold rounded-xl">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HospitalNavbar;