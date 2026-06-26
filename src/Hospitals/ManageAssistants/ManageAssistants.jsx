import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { Users, PlusCircle, Trash2, RefreshCw, ShieldAlert, CheckCircle2, Link2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageAssistants = () => {
  const { user } = useContext(AuthContext);
  const [assistants, setAssistants] = useState([]);
  const [activeDoctors, setActiveDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // লোডার ট্র্যাকিং
  const navigate = useNavigate();

  // 🎯 ডাটা লোড ফাংশন
  const loadData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const astRes = await fetch(`http://localhost:3000/hospitals/assistants/${user.email}`);
      const astData = await astRes.json();
      setAssistants(Array.isArray(astData) ? astData : []);

      const docRes = await fetch(`http://localhost:3000/hospitals/doctors/${user.email}`);
      const docData = await docRes.json();
      setActiveDoctors(Array.isArray(docData) ? docData.filter(doc => doc.status === 'active') : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // 🎯 ডক্টর অ্যাসাইন করার প্রফেশনাল ফাংশন
  const handleAssignDoctor = async (assistantId, doctorEmail) => {
    const selectedDoc = activeDoctors.find(d => d.doctorEmail === doctorEmail);
    const updatePayload = { 
      assignedDoctorEmail: doctorEmail, 
      assignedDoctorName: selectedDoc ? selectedDoc.doctorName : "Not Assigned" 
    };
    
    setUpdatingId(assistantId); // ইন-লাইন লোডিং শুরু

    try {
      const res = await fetch(`http://localhost:3000/hospitals/assistants/update-doctor/${assistantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      // HTML এরর পেজ যাতে JSON ডিকোডিং ক্র্যাশ না করে তার সিকিউরিটি
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server returned status ${res.status}. Route might be wrong.`);
      }

      const result = await res.json();
      
      if (result.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Roster mapped successfully!',
          showConfirmButton: false,
          timer: 2000
        });
        loadData(); // রিয়েল-টাইম রিফ্রেশ
      } else {
        Swal.fire('Failed', result.message || 'Mapping upgrade failed', 'error');
      }
    } catch (error) {
      console.error("Client Error:", error);
      Swal.fire({
        title: 'API Route Connection Lost',
        text: 'Backend endpoint returned 404. Please check server.js prefixes or base URL.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUpdatingId(null); // লোডিং সমাপ্ত
    }
  };

  // 🎯 অ্যাসিস্ট্যান্ট ব্যান/আনব্যান
  const handleToggleBan = (id, currentStatus) => {
    const nextStatus = currentStatus === 'banned' ? 'active' : 'banned';
    Swal.fire({
      title: 'Modify Control Status?',
      text: `Are you sure you want to transition this account to ${nextStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nextStatus === 'banned' ? '#ef4444' : '#10b981',
      confirmButtonText: 'Confirm Status Change'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/hospitals/assistants/status/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
          });
          if(res.ok) {
            Swal.fire('Success!', `Account is now ${nextStatus}.`, 'success');
            loadData();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  // 🎯 অ্যাসিস্ট্যান্ট ডিলিট
  const handleDeleteAssistant = (id) => {
    Swal.fire({
      title: 'Purge Profile?',
      text: "Permanent action! Relational database links will be broken.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Workspace Profile'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/hospitals/assistants/delete/${id}`, { method: 'DELETE' });
          if(res.ok) {
            Swal.fire('Purged!', 'Assistant data removed.', 'success');
            loadData();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900">👥 Workspace Assistants Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">Control operational statuses, access keys, and link healthcare providers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="btn btn-ghost btn-circle border border-gray-100 bg-gray-50 hover:bg-gray-100">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => navigate('/hospital_admin_dashboard/addAssistance')} className="btn btn-primary rounded-xl font-bold flex items-center gap-2 text-sm text-white">
            <PlusCircle className="w-4 h-4" /> Onboard Assistant
          </button>
        </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-x-auto">
        {loading && assistants.length === 0 ? (
          <div className="flex justify-center py-12"><span className="loading loading-spinner text-primary loading-lg"></span></div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No Assistants Onboarded</h3>
            <p className="text-xs text-gray-400">Add operational staff to manage care scheduling.</p>
          </div>
        ) : (
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th>Assistant Core Info</th>
                <th>Contact Link</th>
                <th>Assigned Provider</th>
                <th>Access Policy</th>
                <th className="text-right">Administrative Engine</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 font-semibold">
              {assistants.map((ast) => (
                <tr key={ast._id} className="border-b border-gray-50">
                  <td>
                    <div className="font-bold text-gray-900">{ast.assistantName}</div>
                    <div className="text-xs text-gray-400 font-normal">{ast.assistantEmail}</div>
                  </td>
                  <td className="font-mono text-xs">{ast.phone || 'N/A'}</td>
                  <td>
                    <div className="relative w-fit flex items-center gap-2">
                      <select 
                        disabled={updatingId === ast._id}
                        className="select select-bordered select-sm rounded-xl bg-gray-50 font-bold text-xs border-gray-200" 
                        value={ast.assignedDoctorEmail || ""} 
                        onChange={(e) => handleAssignDoctor(ast._id, e.target.value)}
                      >
                        <option value="">⚠️ Roster Unassigned</option>
                        {activeDoctors.map((doc) => (
                          <option key={doc._id} value={doc.doctorEmail}>👨‍⚕️ {doc.doctorName}</option>
                        ))}
                      </select>
                      {updatingId === ast._id && <span className="loading loading-spinner loading-xs text-primary"></span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-sm border-none font-bold px-2.5 py-2 ${
                      ast.status === 'active' ? 'bg-green-50 text-green-600' : ast.status === 'banned' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {ast.status === 'active' ? 'Active Access' : ast.status === 'banned' ? '❌ Suspended' : 'Pending Verification'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBan(ast._id, ast.status)} 
                        className={`btn btn-circle btn-xs border-none ${ast.status === 'banned' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`} 
                        title={ast.status === 'banned' ? "Unban Profile" : "Ban Profile"}
                      >
                        {ast.status === 'banned' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDeleteAssistant(ast._id)} className="btn btn-ghost btn-circle text-red-500 hover:bg-red-50 btn-xs" title="Delete Profile">
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

export default ManageAssistants;