import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const AssistantSchedule = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');

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
        console.error(err);
        setLoading(false);
      });
  }, [user?.email]);

  const fetchAppointments = async () => {
    if (!selectedDoctorEmail) return;
    try {
      const response = await axios.get(`http://localhost:3000/doctors/my-bookings/${selectedDoctorEmail}`);
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctorEmail) {
      fetchAppointments();
    }
  }, [selectedDoctorEmail]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const result = await Swal.fire({ title: `Mark status as ${newStatus}?`, icon: 'warning', showCancelButton: true });
      if (result.isConfirmed) {
        const response = await axios.patch(`http://localhost:3000/doctors/bookings/status/${id}`, { status: newStatus });
        if (response.data.success) {
          Swal.fire('Updated!', 'General status updated successfully.', 'success');
          fetchAppointments();
        }
      }
    } catch (err) { Swal.fire('Error', 'Action failed', 'error'); }
  };

  const filteredAppointments = useMemo(() => {
    return bookings.filter(b => {
      const matchDate = b.appointmentDate ? new Date(b.appointmentDate).toISOString().split('T')[0] === filterDate : false;
      const matchStatus = filterStatus === 'all' ? true : b.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchDate && matchStatus;
    });
  }, [bookings, filterDate, filterStatus]);

  if (loading && doctorsList.length === 0) return <div className="text-center py-20 text-gray-500">Checking Appointment Grid...</div>;

  if (doctorsList.length === 0) {
    return <div className="max-w-6xl mx-auto bg-rose-50 text-rose-800 border border-rose-200 p-8 rounded-2xl text-center font-bold mt-10">⚠️ Live Schedules Halted: You are not assigned to any doctor workflow yet.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-950 to-slate-900 p-6 rounded-2xl text-white mb-6 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">📅 Assistant Appointment Desk</h2>
          <p className="text-xs text-indigo-100">Manage appointment status and entry logs here.</p>
        </div>
        <div>
          <select value={selectedDoctorEmail} onChange={(e) => setSelectedDoctorEmail(e.target.value)} className="bg-slate-900 text-white text-xs font-bold p-2.5 rounded-xl border border-slate-700 outline-none">
            {doctorsList.map(doc => <option key={doc._id} value={doc.doctorEmail}>Dr. {doc.doctorName}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Target Date Grid</label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Filter Global Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs font-bold">
            <option value="all">All Registrations</option>
            <option value="pending">⏳ Pending Reviews</option>
            <option value="confirmed">🟢 Confirmed Slots</option>
            <option value="completed">✅ Finalized Entries</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-wider border-b text-gray-400">
            <tr>
              <th className="p-4">Patient Demographics</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Global Status</th>
              <th className="p-4 text-right">Action Engine</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y">
            {filteredAppointments.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-10 font-bold text-gray-400">No logs captured matching targeted criteria.</td></tr>
            ) : (
              filteredAppointments.map(apnt => (
                <tr key={apnt._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{apnt.patientName}</td>
                  <td className="p-4 text-gray-500">{apnt.patientPhone}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black border bg-green-50 text-green-700 border-green-200">{apnt.status}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {apnt.status === 'pending' && <button onClick={() => handleStatusUpdate(apnt._id, 'confirmed')} className="px-2.5 py-1 bg-green-600 text-white font-bold rounded-lg text-[11px]">Confirm</button>}
                    {apnt.status === 'confirmed' && <button onClick={() => handleStatusUpdate(apnt._id, 'completed')} className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-[11px]">Complete</button>}
                    {apnt.status !== 'cancelled' && apnt.status !== 'completed' && <button onClick={() => handleStatusUpdate(apnt._id, 'cancelled')} className="px-2.5 py-1 bg-red-100 text-red-700 font-bold rounded-lg text-[11px]">Cancel</button>}
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

export default AssistantSchedule;