import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import Logo from '../../../hook/Logo';

const AssistantLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logOut()
      .then(() => navigate('/login'))
      .catch(err => console.error(err));
  };

  const menuItems = [
  
    { name: '👨‍⚕️ My Profile', path: '/assis_dashboard/assistantProfile' },
    { name: '📅 Appointment Desk', path: '/assis_dashboard/assistantSchedules' },
    { name: '📢 Live Queue Stream', path: '/assis_dashboard/assistantLiveQueue' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 💻 সাইডবার (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 bg-slate-950">
            <h1 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
               <Logo></Logo> <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">ASSISTANT</span>
            </h1>
          </div>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 👤 লগআউট এবং ইউজার ইনফো */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white text-xs">
              {user?.email ? user.email[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.displayName || 'Assistant Operator'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-200 rounded-xl text-xs font-bold transition-all border border-slate-700/50"
          >
            🔒 Sign Out Terminal
          </button>
        </div>
      </aside>

      {/* 🖥️ মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 🔝 টপ ন্যাভবার (Top Navbar) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg border">
              🟢 Live Node: Connected
            </span>
          </div>
          <div className="text-xs font-bold text-slate-500">
            {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* 📄 ডাইনামিক পেজ ভিউ */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AssistantLayout;