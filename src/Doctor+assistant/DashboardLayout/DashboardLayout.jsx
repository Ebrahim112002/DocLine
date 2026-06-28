import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Logo from '../../hook/Logo';

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext); // আপনার AuthContext অনুযায়ী
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // রোলের উপর ভিত্তি করে ডাইনামিক সাইডবার মেনু
  const isDoctor = user?.role?.toLowerCase() === 'doctor';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 🔹 সাইডবার */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800">
        <div>
          {/* লোগো/ব্র্যান্ড */}
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
            <div>
              <Logo></Logo>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                {user?.role || 'Panel'}
              </span>
            </div>
          </div>

          {/* মেনু আইটেমসমূহ */}
          <nav className="mt-6 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              📊 <span>Dashboard Home</span>
            </Link>

            {/* 🩺 শুধুমাত্র ডক্টরের মেনু */}
            {isDoctor && (
              <>
               
                <Link to="/dashboard/doctorSchedules" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
                  ⏳ <span>My Schedules</span>
                </Link>
              </>
            )}

            {/* 📢 ডক্টর এবং অ্যাসিস্ট্যান্ট উভয়ের জন্যই কমন কিউ লাইভ মনিটর */}
            <Link to="/dashboard/doctorLiveQueue" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              📢 <span>Live Queue Monitor</span>
            </Link>

            <Link to="/dashboard/doctorProfile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              👤 <span>My Profile</span>
            </Link>
          </nav>
        </div>

        {/* লগআউট বাটন */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white transition border border-red-900/30"
        >
          🚪 <span>Log Out</span>
        </button>
      </div>

      {/* 🔹 মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ডাইনামিক নেভবার এখানে বসবে */}
        {/* <Navbar /> */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* এখানে ডাইনামিকালি পেজগুলো লোড হবে */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;