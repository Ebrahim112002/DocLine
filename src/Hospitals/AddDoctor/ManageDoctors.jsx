import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { UserPlus, Trash2, Image, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageDoctors = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/hospitals/doctors/${user.email}`);
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [user?.email]);

  const handleToggleBan = (id, currentStatus) => {
    const nextStatus = currentStatus === 'banned' ? 'active' : 'banned';
    const actionText = nextStatus === 'banned' ? 'Suspend' : 'Activate';

    Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${actionText.toLowerCase()} this doctor!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nextStatus === 'banned' ? '#ef4444' : '#10b981',
      confirmButtonText: `Yes, ${actionText}!`
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/hospitals/doctors/status/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Swal.fire('Success!', `Doctor is now ${nextStatus}.`, 'success');
            fetchDoctors();
          }
        });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Doctor?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/hospitals/doctors/delete/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              Swal.fire('Deleted!', 'Doctor has been removed.', 'success');
              fetchDoctors();
            }
          });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button - unchanged */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900">👨‍⚕️ Manage Doctors</h2>
          <p className="text-xs text-gray-400 mt-0.5">Complete CRUD suite for healthcare providers.</p>
        </div>
        <button 
          onClick={() => navigate('/hospital_admin_dashboard/addDoctor')} 
          className="btn btn-primary rounded-xl font-bold flex items-center gap-2 text-sm shadow-md"
        >
          <UserPlus className="w-4 h-4" /> Add New Doctor
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-6">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : (
          <table className="table table-zebra w-full text-sm">
            {/* Table remains same as you had - no design change */}
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th>Doctor</th>
                <th>Email</th>
                <th>Specialty</th>
                <th>Account Status</th>
                <th>Assigned Assistant</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 font-semibold">
              {doctors.map((doc) => (
                <tr key={doc._id} className="border-b border-gray-50">
                  {/* ... তোমার আগের টেবিল কন্টেন্ট একদম অপরিবর্তিত রাখা হয়েছে ... */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                          {doc.image ? <img src={doc.image} alt="doc" className="w-full h-full object-cover" /> : <Image className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{doc.doctorName}</div>
                        <div className="text-xs text-gray-400">{doc.primaryDegree}</div>
                      </div>
                    </div>
                  </td>
                  <td>{doc.doctorEmail}</td>
                  <td><span className="badge badge-sm bg-blue-50 text-blue-600 border-none px-2.5 py-2 font-bold">{doc.specialty}</span></td>
                  <td>
                    <span className={`badge badge-sm font-bold border-none px-2.5 py-2 ${
                      doc.status === 'active' ? 'bg-green-50 text-green-600' : 
                      doc.status === 'banned' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status === 'active' ? 'Active' : doc.status === 'banned' ? '❌ Suspended' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {doc.assignedAssistantName ? (
                      <span className="flex items-center gap-1.5 text-xs text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl w-fit">
                        <UserCheck className="w-3.5 h-3.5 text-green-600" /> {doc.assignedAssistantName}
                      </span>
                    ) : <span className="text-xs text-gray-400 italic">None</span>}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBan(doc._id, doc.status)} 
                        className={`btn btn-circle btn-xs border-none ${doc.status === 'banned' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                      >
                        {doc.status === 'banned' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(doc._id)} className="btn btn-ghost btn-circle text-red-500 hover:bg-red-50 btn-xs">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageDoctors;