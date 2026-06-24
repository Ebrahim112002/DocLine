import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Menu, X, LogOut, ShieldAlert } from 'lucide-react';

import AdminNavbar from '../Admin_navbar/AdminNavbar';

import { AuthContext } from '../../Context/AuthContext';
import AdminHome from '../Admin_home/AdminHome';

const AdminDashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* মোবাইল স্ক্রিনের জন্য রেসপন্সিভ টপ-বার */}
      <div className="md:hidden bg-white text-gray-800 p-4 flex justify-between items-center shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-blue-600 w-6 h-6" />
          <span className="font-bold text-lg">DocLine Admin</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 hover:bg-gray-100 rounded-xl">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ডেস্কটপ ভিউতে লেফট সাইডবার */}
      <div className="hidden md:block">
        <AdminNavbar />
      </div>

      {/* মোবাইল ভিউর জন্য সাইডবার ড্রয়ার */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20" onClick={() => setIsMobileOpen(false)}>
          <AdminNavbar />
          <div className="p-4 border-t border-gray-100 absolute bottom-0 w-full">
            <button onClick={handleLogOut} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-50 text-red-600 rounded-xl font-semibold">
              <LogOut className="w-5 h-5" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* মেইন কনটেন্ট সেকশন যেখানে রাইট সাইডের বাকি কম্পোনেন্ট সহ AdminHome লোড হবে */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* টপ প্রোফাইল বার (ডেস্কটপ) */}
        <header className="hidden md:flex bg-white h-20 items-center justify-end px-10 border-b border-gray-100 gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h4 className="font-bold text-gray-800 text-sm">{user?.displayName || "এডমিন"}</h4>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <img src={user?.photoURL || "https://i.ibb.co/6R7Y7Z1/default-avatar.png"} alt="Admin" className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-600" />
          </div>
          <button onClick={handleLogOut} className="ml-4 p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="লগআউট">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* AdminHome কম্পোনেন্টকে বাকি বডিতে কল করা হলো */}
     <AdminHome></AdminHome>
      </div>

    </div>
  );
};

export default AdminDashboard;