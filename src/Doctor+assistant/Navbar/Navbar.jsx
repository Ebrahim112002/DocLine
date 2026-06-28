import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shadow-sm">
      {/* বাম পাশ: ওয়েলকাম মেসেজ */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm">
          Welcome back, <span className="text-indigo-600 font-bold">{user?.displayName || 'User'}</span> 👋
        </h3>
        <p className="text-[11px] text-gray-400">Have a great and productive day ahead.</p>
      </div>

      {/* ডান পাশ: প্রোফাইল ট্রিগার */}
      <div className="flex items-center gap-4">
        {/* লাইভ রোল ব্যাজ */}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
          user?.role?.toLowerCase() === 'doctor' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {user?.role || 'Staff'}
        </span>

        {/* প্রোফাইল ইমেজ */}
        <div className="flex items-center gap-2 border-l pl-4">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-inner">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-800 leading-tight">{user?.displayName || 'Hospital Staff'}</p>
            <p className="text-[10px] text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;