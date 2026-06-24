import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Users, Building2, ShieldAlert, Calendar } from 'lucide-react';
import { AuthContext } from '../../Context/AuthContext';


const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isDashboardRoot = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[calc(100vh-160px)]">
        
        {isDashboardRoot ? (
          /* সুন্দর ওয়েলকাম এবং ড্যাশবোর্ড অ্যানালিটিক্স প্যানেল */
          <div className="space-y-8">
            
            {/* ওয়েলকাম কার্ড ব্যানার */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/10">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                  <img 
                    src={user?.photoURL || "https://i.ibb.co/6R7Y7Z1/default-avatar.png"} 
                    alt="Admin Avatar" 
                    className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-lg"
                  />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      স্বাগতম, {user?.displayName || "এডমিনিস্ট্রেটর"}! 🎉
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base mt-1 font-medium">
                      DocLine হেলথকেয়ার সিস্টেমের সম্পূর্ণ কন্ট্রোল এখন আপনার হাতে।
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block">আপনার রোল</span>
                  <span className="text-lg font-bold text-white uppercase">{user?.role || 'Admin'}</span>
                </div>
              </div>
              
              {/* ব্যাকগ্রাউন্ড ডেকোরেশন ইফেক্ট */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* স্ট্যাটিস্টিকস ওভারভিউ কার্ড গ্রিড */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-gray-400" />
                সিস্টেম ওভারভিউ
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* কার্ড ১: মোট ইউজার */}
                <div className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 bg-gray-50/50 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">মোট একটিভ ইউজার</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">ম্যানেজ করুন</p>
                  </div>
                </div>

                {/* কার্ড ২: হাসপাতালসমূহ */}
                <div className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 bg-gray-50/50 hover:shadow-md transition-shadow">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">নিবন্ধিত হাসপাতাল</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">লিস্ট দেখুন</p>
                  </div>
                </div>

                {/* কার্ড ৩: সিকিউরিটি প্যানেল */}
                <div className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 bg-gray-50/50 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                  <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">সিস্টেম সিকিউরিটি</p>
                    <p className="text-green-600 font-bold text-lg mt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Secure
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* অন্যান্য চাইল্ড কম্পোনেন্টগুলো (যেমন: ManageUsers) এখানে রেন্ডার হবে */
          <Outlet />
        )}

      </div>
    </main>
  );
};

export default AdminHome;