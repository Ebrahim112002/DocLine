import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const DoctorMyProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');

  const [doctorData, setDoctorData] = useState({
    doctorName: '', doctorEmail: '', specialty: '', primaryDegree: '',
    visitFee: 0, patientLimitPerDay: 20, availableDays: [], roomNumber: '', phone: '', bio: '', assistantEmail: '', assistantName: ''
  });

  const isAssistant = user?.email?.toLowerCase().includes('assistant') || false;
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (isAssistant && user?.email) {
      axios.get(`http://localhost:3000/doctors/all-doctors/${user.email}`)
        .then(res => {
          setDoctorsList(res.data);
          if (res.data.length > 0) setSelectedDoctorEmail(res.data[0].doctorEmail);
        });
    }
  }, [isAssistant, user?.email]);

  const fetchProfile = async () => {
    const targetEmail = isAssistant ? selectedDoctorEmail : user?.email;
    if (!targetEmail) return;

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/doctors/profile/${targetEmail}`);
      if (res.data) {
        setDoctorData({
          doctorName: res.data.doctorName || '',
          doctorEmail: res.data.doctorEmail || '',
          specialty: res.data.specialty || '',
          primaryDegree: res.data.primaryDegree || '',
          visitFee: res.data.visitFee || 0,
          patientLimitPerDay: res.data.patientLimitPerDay || 20,
          availableDays: res.data.availableDays || [],
          roomNumber: res.data.roomNumber || '',
          phone: res.data.phone || '',
          bio: res.data.bio || res.data.biography || '', // ⚡ Recover mapping safely
          assistantEmail: res.data.assistantEmail || '',
          assistantName: res.data.assistantName || ''
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Oops', text: 'Failed to retrieve profile structure ledger.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.email, selectedDoctorEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayCheckbox = (day) => {
    let updatedDays = [...doctorData.availableDays];
    if (updatedDays.includes(day)) {
      updatedDays = updatedDays.filter(d => d !== day);
    } else {
      updatedDays.push(day);
    }
    setDoctorData(prev => ({ ...prev, availableDays: updatedDays }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = isAssistant ? selectedDoctorEmail : user?.email;
    try {
      const res = await axios.put(`http://localhost:3000/doctors/profile/update/${targetEmail}`, doctorData);
      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Medical metadata saved securely.' });
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Server connection error.' });
    }
  };

  if (loading) return <div className="text-center py-20 text-xs font-bold text-gray-400">Loading Doctor Profile Matrix Data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Physician Control Ledger</h2>
          <p className="text-xs text-gray-400">Monitor and keep diagnostic parameters and checkup metadata synchronized.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs">
            ⚙️ Edit Configuration
          </button>
        )}
      </div>

      {isAssistant && (
        <div className="bg-slate-50 border p-4 rounded-2xl flex items-center gap-4">
          <label className="text-xs font-black text-slate-700">Select Tracked Physician:</label>
          <select value={selectedDoctorEmail} onChange={(e) => setSelectedDoctorEmail(e.target.value)} className="bg-white border rounded-xl p-2 text-xs font-bold">
            {doctorsList.map(doc => <option key={doc._id} value={doc.doctorEmail}>{doc.doctorName}</option>)}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Doctor Full Name</label><input type="text" name="doctorName" value={doctorData.doctorName} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border bg-slate-50/50 disabled:text-gray-400" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Official Doctor Email</label><input type="email" name="doctorEmail" value={doctorData.doctorEmail} disabled className="w-full p-2.5 rounded-xl border bg-gray-100 text-gray-400 cursor-not-allowed" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Medical Specialty Category</label><input type="text" name="specialty" value={doctorData.specialty} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Primary Degrees</label><input type="text" name="primaryDegree" value={doctorData.primaryDegree} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Session Visit Fee (৳)</label><input type="number" name="visitFee" value={doctorData.visitFee} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Daily Patient Capacity Limit</label><input type="number" name="patientLimitPerDay" value={doctorData.patientLimitPerDay} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Operator Contact Phone</label><input type="text" name="phone" value={doctorData.phone} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1">Room / Cabin Number</label><input type="text" name="roomNumber" value={doctorData.roomNumber} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border" /></div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Chamber Active Weekly Schedule Days</label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map(day => (
              <label key={day} className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${doctorData.availableDays?.includes(day) ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' : 'bg-white text-gray-400'}`}>
                <input type="checkbox" checked={doctorData.availableDays?.includes(day) || false} disabled={!isEditing} onChange={() => handleDayCheckbox(day)} className="hidden" />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Professional Biography & Overview Summary</label>
          <textarea name="bio" rows="3" value={doctorData.bio} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border text-xs resize-none" placeholder="Enter professional details, clinical background profile or notes..." />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 border-t pt-4">
            <button type="button" onClick={() => { setIsEditing(false); fetchProfile(); }} className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 bg-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs">Save Master Config</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DoctorMyProfile;