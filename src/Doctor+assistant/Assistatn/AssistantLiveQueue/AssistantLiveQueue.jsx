import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const AssistantLiveQueue = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');
  
  const [filterDate, setFilterDate] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [queueFilterStatus, setQueueFilterStatus] = useState('all');

  useEffect(() => {
    if (!user?.email) return;

    axios.get(`http://localhost:3000/doctors/all-doctors/${user.email}`)
      .then(res => {
        setDoctorsList(res.data);
        if (res.data && res.data.length > 0) {
          setSelectedDoctorEmail(res.data[0].doctorEmail);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error loading doctors:", err);
        setLoading(false);
      });
  }, [user?.email]);

  const fetchLiveQueue = async () => {
    if (!selectedDoctorEmail) return;
    try {
      const response = await axios.get(`http://localhost:3000/doctors/my-bookings/${selectedDoctorEmail}`);
      const data = Array.isArray(response.data) ? response.data : [];
      const activeQueues = data.filter(b => b.status === 'confirmed');
      setBookings(activeQueues);
    } catch (err) {
      console.error("❌ Error loading queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctorEmail) {
      fetchLiveQueue();
    }
  }, [selectedDoctorEmail]);

  const handleQueueStatusChange = async (id, newQueueStatus) => {
    try {
      const response = await axios.patch(`http://localhost:3000/doctors/bookings/queue-status/${id}`, {
        queueStatus: newQueueStatus
      });
      if (response.data.success) {
        Swal.fire({ title: 'Queue Updated', text: `Status: ${newQueueStatus.toUpperCase()}`, icon: 'success', timer: 900, showConfirmButton: false });
        fetchLiveQueue();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update live queue status.', 'error');
    }
  };

  const processedQueueList = useMemo(() => {
    return bookings
      .filter(b => {
        const bookingDateStr = b.appointmentDate ? new Date(b.appointmentDate).toISOString().split('T')[0] : '';
        const matchDate = filterDate === 'all' ? true : bookingDateStr === filterDate;
        const searchLower = searchQuery.toLowerCase().trim();
        const matchSearch = searchLower === '' ? true : (
          b.patientName?.toLowerCase().includes(searchLower) || b.patientPhone?.includes(searchLower) || String(b.queueNumber).includes(searchLower)
        );
        const currentQueueStatus = b.queueStatus || 'waiting';
        const matchQueueStatus = queueFilterStatus === 'all' ? true : currentQueueStatus === queueFilterStatus;
        return matchDate && matchSearch && matchQueueStatus;
      })
      .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0));
  }, [bookings, filterDate, searchQuery, queueFilterStatus]);

  if (loading && doctorsList.length === 0) return <div className="text-center py-20 text-sm font-semibold text-gray-500">Checking Assigned Doctors Dashboard...</div>;

  if (doctorsList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-amber-50 text-amber-800 border border-amber-200 p-8 rounded-2xl text-center font-bold mt-10">
        ⚠️ No Assigned Doctor Configuration Mapped for Operator: ({user?.email}).
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-black tracking-tight">Assistant Live Queue Panel</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time patient tracking terminal for clinical chambers.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <label className="text-xs font-bold text-slate-300">Target Doctor:</label>
            <select 
              value={selectedDoctorEmail} 
              onChange={(e) => setSelectedDoctorEmail(e.target.value)} 
              className="bg-slate-900 text-white text-xs font-bold p-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
            >
              {doctorsList.map(doc => <option key={doc._id} value={doc.doctorEmail}>Dr. {doc.doctorName}</option>)}
            </select>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-xs">
            <span className="font-medium text-slate-300">Active Queue: </span>
            <span className="font-black text-emerald-400">{processedQueueList.length} Patient(s)</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-b grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Operational Date</label>
          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="all">🗓️ All Dates</option>
            {[...new Set(bookings.map(b => b.appointmentDate ? new Date(b.appointmentDate).toISOString().split('T')[0] : ''))].filter(Boolean).sort().map(date => <option key={date} value={date}>📅 {date}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Queue Stage</label>
          <select value={queueFilterStatus} onChange={(e) => setQueueFilterStatus(e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm">
            <option value="all">🔍 All Stages</option>
            <option value="waiting">⏳ Waiting</option>
            <option value="called">📢 Called</option>
            <option value="in_progress">🩺 Inside Chamber</option>
            <option value="completed">✅ Completed</option>
            <option value="skipped">⏩ Skipped</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Quick Search</label>
          <input type="text" placeholder="Search name, token..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-wider">
              <th className="p-4">Serial / Token</th>
              <th className="p-4">Patient Particulars</th>
              <th className="p-4">Problem Statement</th>
              <th className="p-4">Queue Live Status</th>
              <th className="p-4 text-right">Action Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs">
            {processedQueueList.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-10 font-bold text-gray-400 bg-slate-50/50">🎉 No active stream queues registered for this filter context.</td></tr>
            ) : (
              processedQueueList.map((patient) => (
                <tr key={patient._id} className={`hover:bg-slate-50/80 transition-colors ${patient.queueStatus === 'in_progress' ? 'bg-indigo-50/30' : ''}`}>
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-black">
                      <span className="text-[10px] text-slate-400">#</span>
                      <span className="text-sm">{patient.queueNumber}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <h4 className="font-black text-gray-800 text-sm">{patient.patientName}</h4>
                    <p className="text-gray-400 text-[11px]">{patient.patientPhone} • {patient.patientAge} Y/O</p>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{patient.patientProblem || 'No symptoms logs.'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-100 text-amber-700 border-amber-200">
                      {patient.queueStatus || 'waiting'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select value={patient.queueStatus || 'waiting'} onChange={(e) => handleQueueStatusChange(patient._id, e.target.value)} className="p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold">
                      <option value="waiting">⏳ Waiting</option>
                      <option value="called">📢 Called</option>
                      <option value="in_progress">🩺 In Progress</option>
                      <option value="completed">✅ Completed</option>
                      <option value="skipped">⏩ Skipped</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssistantLiveQueue;