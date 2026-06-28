import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, waiting: 0, completed: 0, called: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        // এডমিন বুকিং এপিআই থেকেই ডেটা ফিল্টার করে লাইভ স্ট্যাটাস জেনারেট করা হচ্ছে
        const response = await axios.get(`http://localhost:3000/hospitals/bookings/${user.email}`);
        const data = Array.isArray(response.data) ? response.data : [];
        
        // শুধুমাত্র কনফার্মড কিউ বুকিং ফিল্টার
        const activeQueues = data.filter(b => b.status === 'confirmed');

        // লাইভ পরিসংখ্যান কাউন্ট লজিক
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysData = activeQueues.filter(b => b.appointmentDate && new Date(b.appointmentDate).toISOString().split('T')[0] === todayStr);

        setStats({
          total: todaysData.length,
          waiting: todaysData.filter(b => b.queueStatus === 'waiting' || !b.queueStatus).length,
          called: todaysData.filter(b => b.queueStatus === 'called' || b.queueStatus === 'in_progress').length,
          completed: todaysData.filter(b => b.queueStatus === 'completed').length,
        });
      } catch (err) {
        console.error("Error generating dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user?.email]);

  const isDoctor = user?.role?.toLowerCase() === 'doctor';

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Dashboard Terminal...</div>;

  return (
    <div className="space-y-6">
      {/* গ্রিটিংস ব্যানার */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
        <h1 className="text-2xl font-black">Hello, {isDoctor ? 'Dr. ' : ''}{user?.displayName || 'User'}!</h1>
        <p className="text-xs text-indigo-100 mt-1">Here is the live operational summary for your shift today.</p>
      </div>

      {/* 📊 কার্ড প্যানেল স্ট্যাটিস্টিকস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Total Patients Today</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase">👥 In Waiting Line</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{stats.waiting}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-blue-500 uppercase">📢 Currently Called</p>
          <p className="text-3xl font-black text-blue-600 mt-1">{stats.called}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-500 uppercase">✅ Served/Completed</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* ⚡ কুইক অ্যাকশন হাব */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-md mb-4">⚡ Quick Operational Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/queue" className="px-5 py-3 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition shadow-sm">
            📢 Open Live Queue Controller
          </Link>
          
          {isDoctor && (
            <Link to="/dashboard/prescriptions" className="px-5 py-3 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition shadow-sm">
              📝 Create New E-Prescription
            </Link>
          )}

          <Link to="/dashboard/profile" className="px-5 py-3 bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-200 transition">
            ⚙️ Account Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;