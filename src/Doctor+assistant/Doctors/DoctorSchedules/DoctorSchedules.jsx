import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const DoctorSchedules = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');

  const isAssistant = user?.email?.toLowerCase().includes('assistant') || false;

  useEffect(() => {
    if (isAssistant && user?.email) {
      axios.get(`http://localhost:3000/doctors/all-doctors/${user.email}`)
        .then(res => {
          setDoctorsList(res.data);
          if (res.data.length > 0) setSelectedDoctorEmail(res.data[0].doctorEmail);
        });
    }
  }, [isAssistant, user?.email]);

  const fetchAppointments = async () => {
    const targetEmail = isAssistant ? selectedDoctorEmail : user?.email;
    if (!targetEmail) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/doctors/my-bookings/${targetEmail}`);
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [user?.email, selectedDoctorEmail]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `Mark as ${newStatus}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update'
      });

      if (result.isConfirmed) {
        const response = await axios.patch(`http://localhost:3000/doctors/bookings/status/${id}`, { status: newStatus });
        if (response.data.success) {
          Swal.fire('Success', 'Status Updated', 'success');
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

  if (isAssistant && doctorsList.length === 0) {
    return <div className="max-w-6xl mx-auto bg-rose-50 text-rose-800 border border-rose-200 p-8 rounded-2xl text-center font-bold mt-10">⚠️ Live Schedules Halted: You are not assigned to any doctor yet.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl text-white mb-6 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">📅 Chamber Appointment Registry Desk</h2>
          <p className="text-xs text-indigo-100">Live operational panel to manage slot bookings.</p>
        </div>
        {isAssistant && (
          <select value={selectedDoctorEmail} onChange={(e) => setSelectedDoctorEmail(e.target.value)} className="bg-slate-900 text-white text-xs font-bold p-2 rounded-xl border border-slate-700 outline-none">
            {doctorsList.map(doc => <option key={doc._id} value={doc.doctorEmail}>👨‍⚕️ Dr. {doc.doctorName}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-6 border">
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold">
          <option value="all">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="confirmed">✅ Confirmed</option>
          <option value="completed">🎉 Completed</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
      </div>

      {loading ? <div className="text-center py-6">Loading slots...</div> : filteredAppointments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 text-gray-400 border border-dashed rounded-xl">No logs recorded.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold text-gray-600 border-b uppercase"><th className="p-4">Patient Name</th><th className="p-4">Contact</th><th className="p-4">Global Status</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="text-xs divide-y">
              {filteredAppointments.map(apnt => (
                <tr key={apnt._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold">{apnt.patientName}</td>
                  <td className="p-4">{apnt.patientPhone} ({apnt.patientAge}Y, {apnt.patientGender})</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-blue-50 border">{apnt.status}</span></td>
                  <td className="p-4 text-right space-x-2">
                    {apnt.status === 'pending' && <button onClick={() => handleStatusUpdate(apnt._id, 'confirmed')} className="px-2.5 py-1 bg-green-600 text-white font-bold rounded-lg">Confirm</button>}
                    {apnt.status === 'confirmed' && <button onClick={() => handleStatusUpdate(apnt._id, 'completed')} className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg">Complete</button>}
                    {apnt.status !== 'cancelled' && apnt.status !== 'completed' && <button onClick={() => handleStatusUpdate(apnt._id, 'cancelled')} className="px-2.5 py-1 bg-red-100 text-red-600 font-bold rounded-lg">Cancel</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedules;