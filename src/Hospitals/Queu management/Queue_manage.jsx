import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const Queue_manage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ফিল্টার স্টেটসমূহ
  const [filterDateMode, setFilterDateMode] = useState('today'); // 'today', 'specific', 'all'
  const [specificDate, setSpecificDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'doctor', 'test'
  const [selectedDoctor, setSelectedDoctor] = useState('all'); // 'all' অথবা ডক্টর ইমেইল
  const [doctorsList, setDoctorsList] = useState([]);

  // ডেটা ফেচ করার ফাংশন
  const fetchQueueData = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/hospitals/bookings/${user.email}`);
      const data = Array.isArray(response.data) ? response.data : [];
      
      // শুধুমাত্র কনফার্মড (যাদের অলরেডি কিউ সিরিয়াল তৈরি হয়েছে) বুকিংগুলো কিউ ম্যানেজমেন্টে আসবে
      const confirmedBookings = data.filter(b => b.status === 'confirmed');
      setBookings(confirmedBookings);

      // 🎯 ডক্টর লিস্ট নিখুঁতভাবে তৈরি করার লজিক (Error Free)
      const uniqueDoctors = [];
      confirmedBookings.forEach(b => {
        // কেস-ইনসেনসিটিভ চেক (doctor বা Doctor) এবং অবজেক্ট ভ্যালিডেশন
        const isDoctorType = b.bookingType && b.bookingType.toLowerCase() === 'doctor';
        if (isDoctorType && b.selectedDoctor && b.selectedDoctor.doctorEmail) {
          const docEmail = b.selectedDoctor.doctorEmail.toLowerCase().trim();
          const docName = b.selectedDoctor.doctorName || "Unknown Doctor";
          
          if (!uniqueDoctors.some(d => d.email === docEmail)) {
            uniqueDoctors.push({ name: docName, email: docEmail });
          }
        }
      });
      setDoctorsList(uniqueDoctors);
    } catch (err) {
      console.error("❌ Error fetching queue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, [user?.email]);

  // 🎯 UseMemo দিয়ে শক্তিশালী ফিল্টারিং লজিক (ডক্টর ও টেস্ট আইসোলেশন ফিক্সড)
  const filteredQueues = useMemo(() => {
    let result = [...bookings];

    // ১. ডেট মোড ফিল্টারিং লজিক
    if (filterDateMode === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(b => b.appointmentDate && new Date(b.appointmentDate).toISOString().split('T')[0] === today);
    } else if (filterDateMode === 'specific') {
      result = result.filter(b => b.appointmentDate && new Date(b.appointmentDate).toISOString().split('T')[0] === specificDate);
    } // 'all' মোড হলে ডেট ফিল্টার স্কিপ হবে এবং সব ডাটা দেখাবে

    // ২. ক্যাটাগরি ফিল্টার (doctor এবং test এর টাইপ ফিক্স করা হয়েছে)
    if (filterType !== 'all') {
      result = result.filter(b => b.bookingType && b.bookingType.toLowerCase() === filterType.toLowerCase());
    }

    // ৩. নির্দিষ্ট ডক্টর ফিল্টার
    if (filterType.toLowerCase() === 'doctor' && selectedDoctor !== 'all') {
      result = result.filter(b => b.selectedDoctor && b.selectedDoctor.doctorEmail && b.selectedDoctor.doctorEmail.toLowerCase().trim() === selectedDoctor.toLowerCase().trim());
    }

    // কিউ নম্বর অনুযায়ী ছোট থেকে বড় সাজানো (Serial 1, 2, 3...)
    return result.sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0));
  }, [bookings, filterDateMode, specificDate, filterType, selectedDoctor]);

  // লাইভ কিউ স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleQueueStatusChange = async (id, newQueueStatus) => {
    try {
      const response = await axios.patch(`http://localhost:3000/hospitals/bookings/status/${id}`, {
        queueStatus: newQueueStatus
      });

      if (response.data.success) {
        Swal.fire({ title: 'Updated!', text: `Queue status is now ${newQueueStatus}`, icon: 'success', timer: 1500, showConfirmButton: false });
        fetchQueueData(); // আপডেট শেষে টেবিল রিফ্রেশ
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update queue status.', 'error');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border p-6">
        
        {/* টপ হেডার */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl text-white mb-6">
          <h2 className="text-2xl font-bold">📊 Hospital Live Queue Monitor</h2>
          <p className="text-sm text-emerald-100">Total Active Queues: {bookings.length} | Showing: {filteredQueues.length}</p>
        </div>

        {/* 🛠️ ফিল্টার প্যানেল */}
        <div className="space-y-4 mb-6 bg-slate-100 p-5 rounded-2xl">
          
          {/* ডেট ফিল্টার বাটন গ্রুপ (All Option সহ) */}
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-3">
            <span className="text-xs font-bold uppercase text-gray-500 mr-2">📅 Date Range:</span>
            
            <button 
              onClick={() => setFilterDateMode('today')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${filterDateMode === 'today' ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-200 border'}`}
            >
              Today's Queue
            </button>
            
            <button 
              onClick={() => setFilterDateMode('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${filterDateMode === 'all' ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-200 border'}`}
            >
              All Days (Comprehensive View)
            </button>

            <button 
              onClick={() => setFilterDateMode('specific')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${filterDateMode === 'specific' ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-200 border'}`}
            >
              Pick a Date
            </button>

            {filterDateMode === 'specific' && (
              <input 
                type="date" 
                value={specificDate} 
                onChange={(e) => setSpecificDate(e.target.value)} 
                className="p-1 rounded-lg border bg-white text-xs font-medium focus:ring-1 focus:ring-emerald-500 ml-2" 
              />
            )}
          </div>

          {/* সার্ভিস ও ডক্টর ফিল্টার ড্রপডাউন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">🏥 Service Category</label>
              <select 
                value={filterType} 
                onChange={(e) => { setFilterType(e.target.value); setSelectedDoctor('all'); }}
                className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">✨ All Services Combined</option>
                <option value="doctor">🩺 Doctor Appointments</option>
                <option value="test">🔬 Lab Test Queue</option>
              </select>
            </div>

            {filterType.toLowerCase() === 'doctor' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">👤 Filter By Doctor</label>
                <select 
                  value={selectedDoctor} 
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Doctors</option>
                  {doctorsList.map(doc => <option key={doc.email} value={doc.email}>Dr. {doc.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* 📋 কিউ ডাটা টেবিল */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading Live Queue Stream...</div>
        ) : filteredQueues.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic bg-slate-50 rounded-xl border border-dashed">
            No confirmed active queue found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="p-4 pl-6">Token No.</th>
                  <th className="p-4">Patient Profile</th>
                  <th className="p-4">Service / Provider</th>
                  <th className="p-4">Appnt. Date</th>
                  <th className="p-4">Est. Wait</th>
                  <th className="p-4">Live Queue Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredQueues.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 pl-6">
                      <span className="text-md font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                        #{patient.queueNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{patient.patientName}</div>
                      <div className="text-xs text-gray-500">{patient.patientPhone} • {patient.patientAge}yrs</div>
                    </td>
                    <td className="p-4">
                      {patient.bookingType && patient.bookingType.toLowerCase() === 'doctor' ? (
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Dr. {patient.selectedDoctor?.doctorName || 'N/A'}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          🔬 {patient.selectedTests?.map(t => t.testName || t.name).join(', ') || 'Lab Test Package'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-500">
                      {new Date(patient.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-medium text-gray-600">{patient.estimatedWaitTime || "N/A"}</td>
                    <td className="p-4">
                      <select
                        value={patient.queueStatus || 'waiting'}
                        onChange={(e) => handleQueueStatusChange(patient._id, e.target.value)}
                        className="p-1.5 rounded-xl border text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      >
                        <option value="waiting">⏳ Waiting</option>
                        <option value="called">📢 Called</option>
                        <option value="in_progress">🩺 In Progress</option>
                        <option value="completed">✅ Completed</option>
                        <option value="skipped">⏩ Skipped</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue_manage;