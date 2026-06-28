import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';

const AssistantHome = () => {
  const { user } = useContext(AuthContext);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:3000/doctors/all-doctors/${user.email}`)
        .then(res => {
          setAssignedDoctors(res.data);
        })
        .catch(err => console.error("Error loading summary:", err))
        .finally(() => setLoading(false));
    }
  }, [user?.email]);

  if (loading) return <div className="text-center py-20 text-xs font-bold text-gray-400">Initializing Control Desk...</div>;

  return (
    <div className="space-y-6">
      {/* 🚀 স্বাগতম ব্যানার */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-sm border border-slate-800">
        <h2 className="text-2xl font-black mb-1">Welcome back, Control Operator! 👋</h2>
        <p className="text-xs text-slate-400 max-w-xl">
          This terminal lets you monitor live tokens, control serial lines, and keep the chamber profile updated for synchronized performance.
        </p>
      </div>

      {/* 📊 অ্যাসাইনমেন্ট স্ট্যাটাস বোর্ড */}
      <div className="bg-white rounded-3xl border p-6">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">🩺 Assigned Medical Experts</h3>
        
        {assignedDoctors.length === 0 ? (
          <div className="bg-amber-50 text-amber-800 border border-amber-200 p-6 rounded-2xl font-bold text-xs">
            ⚠️ Attention Required: No doctor has assigned you as their assistant yet. Live features are locked until an admin establishes a linkage.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedDoctors.map((doc) => (
              <div key={doc._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border flex items-center justify-center text-lg mb-3">👨‍⚕️</div>
                  <h4 className="text-sm font-black text-slate-900">Dr. {doc.doctorName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.doctorEmail}</p>
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Active Duty</span>
                  <span className="text-slate-400 font-medium">Token Feed Online</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📝 দ্রুত গাইডলাইন */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-white rounded-2xl border">
          <b className="block text-slate-900 mb-1">1. Update Metadata</b>
          <p className="text-slate-500 leading-relaxed">Modify available days, daily patient limits, or fee adjustments from the Configuration tab.</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border">
          <b className="block text-slate-900 mb-1">2. Manage Registries</b>
          <p className="text-slate-500 leading-relaxed">Accept, finalize, or discard general patient slot bookings at the Appointment Desk.</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border">
          <b className="block text-slate-900 mb-1">3. Live Token Engine</b>
          <p className="text-slate-500 leading-relaxed">Switch states between "Waiting", "Called" and "In Progress" to manipulate the display terminal outside the room.</p>
        </div>
      </div>
    </div>
  );
};

export default AssistantHome;