import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const DoctorLiveQueue = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ফিল্টার স্টেট: default 'all' রাখা হয়েছে যাতে সব তারিখের ডাটা একসাথে দেখা যায়
  const [filterDate, setFilterDate] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [queueFilterStatus, setQueueFilterStatus] = useState('all');

  const fetchLiveQueue = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/doctors/my-bookings/${user.email}`);
      const data = Array.isArray(response.data) ? response.data : [];
      
      // শুধুমাত্র 'confirmed' অ্যাপয়েন্টমেন্টগুলো কিউ লাইনে লাইভ ট্র্যাক হবে
      const activeQueues = data.filter(b => b.status === 'confirmed');
      setBookings(activeQueues);
    } catch (err) {
      console.error("❌ Error loading queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQueue();
  }, [user?.email]);

  const handleQueueStatusChange = async (id, newQueueStatus) => {
    try {
      const response = await axios.patch(`http://localhost:3000/doctors/bookings/queue-status/${id}`, {
        queueStatus: newQueueStatus
      });

      if (response.data.success) {
        Swal.fire({
          title: 'Queue Updated',
          text: `Status shifted to ${newQueueStatus.toUpperCase()}`,
          icon: 'success',
          timer: 900,
          showConfirmButton: false
        });
        fetchLiveQueue();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update live queue status.', 'error');
    }
  };

  // অ্যাডভান্সড ফিল্টারিং ও সর্টিং লজিক (তারিখ, সার্চ কুয়েরি এবং কিউ স্ট্যাটাস)
  const processedQueueList = useMemo(() => {
    return bookings
      .filter(b => {
        // ১. তারিখ ফিল্টার ('all' হলে সব তারিখ পাস হবে)
        const bookingDateStr = b.appointmentDate ? new Date(b.appointmentDate).toISOString().split('T')[0] : '';
        const matchDate = filterDate === 'all' ? true : bookingDateStr === filterDate;

        // ২. সার্চ ফিল্টার (নাম, ফোন বা টোকেন নম্বর দিয়ে খোঁজা)
        const searchLower = searchQuery.toLowerCase().trim();
        const matchSearch = searchLower === '' ? true : (
          b.patientName?.toLowerCase().includes(searchLower) ||
          b.patientPhone?.includes(searchLower) ||
          String(b.queueNumber).includes(searchLower)
        );

        // ৩. কিউ স্ট্যাটাস ফিল্টার (Waiting, In Progress ইত্যাদি)
        const currentQueueStatus = b.queueStatus || 'waiting';
        const matchQueueStatus = queueFilterStatus === 'all' ? true : currentQueueStatus === queueFilterStatus;

        return matchDate && matchSearch && matchQueueStatus;
      })
      // টোকেন বা সিরিয়াল নম্বর অনুযায়ী ছোট থেকে বড় সাজানো হবে
      .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0));
  }, [bookings, filterDate, searchQuery, queueFilterStatus]);

  if (loading) return <div className="text-center py-20 text-gray-500 font-semibold">Loading Live Queue Stream Terminal...</div>;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* প্রোফেশনাল ড্যাশবোর্ড হেডার */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-black tracking-tight">Live Queue Management System</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time patient tracking terminal for clinical chambers.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
          <span className="text-xs font-medium text-slate-300">Total Stream Count:</span>
          <span className="text-sm font-black text-emerald-400">{processedQueueList.length} Patient(s)</span>
        </div>
      </div>

      {/* মাল্টি-ফাংশনাল ফিল্টার কন্ট্রোল প্যানেল */}
      <div className="p-4 bg-slate-50 border-b grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* তারিখ সিলেক্টর (All Dates অপশনসহ) */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Operational Date</label>
          <select 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">🗓️ All Dates (Show Everything)</option>
            {/* ইউনিক ডেটগুলোর অপশন তৈরি করা */}
            {[...new Set(bookings.map(b => b.appointmentDate ? new Date(b.appointmentDate).toISOString().split('T')[0] : ''))]
              .filter(Boolean)
              .sort()
              .map(date => (
                <option key={date} value={date}>📅 {date}</option>
              ))
            }
          </select>
        </div>

        {/* লাইভ কিউ স্ট্যাটাস ফিল্টার */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Queue Stage</label>
          <select 
            value={queueFilterStatus} 
            onChange={(e) => setQueueFilterStatus(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">🔍 All Stages</option>
            <option value="waiting">⏳ Waiting (In Line)</option>
            <option value="called">📢 Called Outside</option>
            <option value="in_progress">🩺 Inside Chamber</option>
            <option value="completed">✅ Completed</option>
            <option value="skipped">⏩ Skipped</option>
          </select>
        </div>

        {/* স্মার্ট সার্চ বার */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Quick Search</label>
          <input 
            type="text"
            placeholder="Search by name, phone or token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

      </div>

      {/* প্রোফেশনাল ডাটা টেবিল */}
      {processedQueueList.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-sm font-bold text-gray-400 italic">No active patient queue matches the current criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-[11px] font-black uppercase text-gray-500 border-b tracking-wider">
                <th className="p-4 pl-6 text-center w-24">Token</th>
                <th className="p-4">Patient Parameters</th>
                <th className="p-4">Schedule Date</th>
                <th className="p-4">Problem Statement</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-center pr-6 w-56">Live Controller Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100">
              {processedQueueList.map((patient) => {
                const currentStatus = patient.queueStatus || 'waiting';
                
                return (
                  <tr key={patient._id} className="hover:bg-slate-50/80 transition duration-150">
                    
                    {/* টোকেন নম্বর */}
                    <td className="p-4 pl-6 text-center">
                      <span className="inline-block text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                        #{patient.queueNumber || 'N/A'}
                      </span>
                    </td>

                    {/* পেশেন্ট প্রোফাইল */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{patient.patientName}</div>
                      <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {patient.patientAge} Yrs • {patient.patientGender} • {patient.patientPhone}
                      </div>
                    </td>

                    {/* তারিখ */}
                    <td className="p-4 font-semibold text-slate-600">
                      {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>

                    {/* সমস্যা বর্ণনা */}
                    <td className="p-4 text-gray-500 max-w-xs truncate font-medium">
                      {patient.patientProblem || <span className="text-gray-300 italic">Routine Checkup</span>}
                    </td>

                    {/* পেমেন্ট স্ট্যাটাস */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        patient.paymentStatus?.toLowerCase() === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {patient.paymentStatus || 'Unpaid'}
                      </span>
                    </td>

                    {/* ড্রপডাউন কন্ট্রোলার */}
                    <td className="p-4 text-center pr-6">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleQueueStatusChange(patient._id, e.target.value)}
                        className={`w-full p-2 rounded-xl text-xs font-black cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 border ${
                          currentStatus === 'in_progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 focus:ring-indigo-500' :
                          currentStatus === 'called' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500' :
                          currentStatus === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' :
                          currentStatus === 'skipped' ? 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500' :
                          'bg-white text-gray-700 border-gray-300 focus:ring-gray-400'
                        }`}
                      >
                        <option value="waiting">⏳ Waiting (In Line)</option>
                        <option value="called">📢 Called (Outside Door)</option>
                        <option value="in_progress">🩺 In Progress (Chamber)</option>
                        <option value="completed">✅ Completed</option>
                        <option value="skipped">⏩ Skipped Slot</option>
                      </select>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorLiveQueue;