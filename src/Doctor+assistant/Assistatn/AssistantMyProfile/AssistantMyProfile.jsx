import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const AssistantMyProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    assistantName: '',
    assistantEmail: '',
    phone: '',
    image: '',
    hospitalName: '',
    doctorName: ''
  });

  const fetchAssistantProfile = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`http://localhost:3000/doctors/assistant-profile/${user.email}`);
      if (res.data.success) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error("Error loading assistant profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAssistantProfile();
    }
  }, [user?.email]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/doctors/assistant-profile/update', profileData);
      if (res.data.success) {
        Swal.fire('Success!', 'Your Profile Updated Successfully.', 'success');
        setIsEditing(false);
        fetchAssistantProfile();
      }
    } catch (err) {
      Swal.fire('Error', 'Update Failed', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Your Control Desk Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-black">📋 My Assistant Profile</h2>
          <p className="text-xs text-indigo-100">Manage your workspace operator credentials and settings.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/20 text-xs font-bold rounded-xl border border-white/10 transition-all hover:bg-white/30">
            ⚙️ Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">My Name</label>
            <input type="text" name="assistantName" value={profileData.assistantName || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border text-xs font-bold focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">My Email</label>
            <input type="text" name="assistantEmail" value={profileData.assistantEmail || ''} disabled className="w-full p-2.5 rounded-xl border text-xs bg-gray-50 text-gray-400 font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Contact Phone</label>
            <input type="text" name="phone" value={profileData.phone || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border text-xs font-bold focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Profile Photo URL</label>
            <input type="text" name="image" value={profileData.image || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Workplace Node Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
            <div>🏢 Station Hospital: <span className="text-indigo-600">{profileData.hospitalName || 'Not Synced'}</span></div>
            <div>👨‍⚕️ Assigned Duty Doctor: <span className="text-emerald-600">Dr. {profileData.doctorName || 'Awaiting Mapping'}</span></div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 border-t pt-4">
            <button type="button" onClick={() => { setIsEditing(false); fetchAssistantProfile(); }} className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-all">Save Changes</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AssistantMyProfile;