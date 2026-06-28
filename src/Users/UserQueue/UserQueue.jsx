import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const UserQueue = () => {
  const { user } = useContext(AuthContext);
  const [myQueues, setMyQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserQueueData = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/bookings/my-bookings', {
        headers: { email: user.email }
      });
      // শুধুমাত্র এপ্রুভড (status: confirmed) করা লাইভ কিউগুলো ট্র্যাকিংয়ে দেখাবে
      const activeConfirmed = (res.data.bookings || []).filter(b => b.status === 'confirmed');
      setMyQueues(activeConfirmed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserQueueData();
  }, [user?.email]);

  // কিউ স্ট্যাটাসের ওপর ভিত্তি করে সুন্দর ব্যাজ কালার জেনারেট করা
  const getStatusBadge = (status) => {
    const styles = {
      waiting: "bg-amber-100 text-amber-800 border-amber-200",
      called: "bg-blue-100 text-blue-800 font-blink border-blue-200 animate-pulse",
      in_progress: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      skipped: "bg-gray-100 text-gray-600 border-gray-200"
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚶‍♂️ Live Queue & Smart Token Tracker</h1>
          <p className="text-gray-500 text-sm">Real-time status synced directly from DocLine live desk.</p>
        </div>
        <button onClick={fetchUserQueueData} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition">
          🔄 Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Connecting to DocLine live desk...</div>
      ) : myQueues.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed p-6">
          <p className="text-gray-500 font-bold text-lg">No Active Live Serials Approved Today.</p>
          <p className="text-xs text-gray-400 mt-1">Once the Hospital Admin clicks Approve, your smart live queue token with details will render instantly.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {myQueues.map((queue) => (
            <div key={queue._id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-teal-600">
              <div className="space-y-1.5">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${getStatusBadge(queue.queueStatus || 'waiting')}`}>
                  • {queue.queueStatus || 'Waiting'}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{queue.hospitalName}</h3>
                <p className="text-sm font-semibold text-slate-700">
                  {queue.bookingType === 'doctor' 
                    ? `👨‍⚕️ Dr. ${queue.selectedDoctor?.doctorName} (${queue.selectedDoctor?.specialty})`
                    : `🔬 Lab Test Packages`}
                </p>
                <div className="text-xs text-gray-400 font-medium space-y-0.5">
                  <p>📅 Date: {new Date(queue.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  <p>⏱️ Est. Wait Time: <span className="text-teal-600 font-bold">{queue.estimatedWaitTime || "Calculating..."}</span></p>
                </div>
              </div>

              {/* Token Badge */}
              <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 border border-slate-200 p-4 rounded-2xl text-center min-w-[150px] w-full md:w-auto">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Live Token Number</p>
                <p className="text-4xl font-black text-teal-600 my-1">
                  #{queue.queueNumber || 'N/A'}
                </p>
                <p className="text-[9px] text-gray-400">Approved by Admin</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserQueue;