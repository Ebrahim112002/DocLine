import React, { useEffect, useState, useContext } from 'react';
import { Building2, ShieldAlert, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';


const ManageHospitals = () => {
  const { user } = useContext(AuthContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access-token');
      const res = await fetch('http://localhost:3000/hospitals/manage-hospitals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? `Bearer ${token}` : '',
          'email': user?.email || ''
        }
      });

      if (!res.ok) throw new Error("ডাটা লোড করতে সমস্যা হয়েছে");
      const data = await res.json();
      setHospitals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchHospitals();
    }
  }, [user?.email]);

  // স্ট্যাটাস পরিবর্তন করার লজিক (Active/Inactive)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const token = localStorage.getItem('access-token');

    try {
      const res = await fetch(`http://localhost:3000/hospitals/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? `Bearer ${token}` : '',
          'email': user?.email || ''
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        Swal.fire('সফল হয়েছে!', `স্ট্যাটাস '${newStatus}' করা হয়েছে।`, 'success');
        fetchHospitals(); // রিফ্রেশ টেবিল
      }
    } catch (error) {
      Swal.fire('এরর', 'স্ট্যাটাস আপডেট করা যায়নি', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="text-gray-500 font-medium text-sm animate-pulse">হসপিটাল ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">হসপিটাল ম্যানেজমেন্ট</h2>
            <p className="text-sm text-gray-500">DocLine-এর সাথে রেজিস্ট্রিকৃত হসপিটালসমূহের তালিকা ও নিয়ন্ত্রণ প্যানেল</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl">
          <span className="text-sm font-medium text-gray-600">মোট হসপিটাল: </span>
          <span className="text-base font-bold text-blue-600">{hospitals.length} টি</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="table table-zebra w-full text-left border-collapse">
          <thead className="bg-gray-50/75 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="py-4 px-6">Hospital Name & Address</th>
              <th className="py-4 px-6">Contact Phone</th>
              <th className="py-4 px-6">Admin Details</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {hospitals.map((h) => (
              <tr key={h._id} className="hover:bg-blue-50/20 border-b border-gray-100 last:border-none">
                <td className="py-4 px-6">
                  <div>
                    <div className="font-bold text-gray-900">{h.hospitalName}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{h.address}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 font-mono">{h.phone}</td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-semibold text-gray-800">{h.adminName}</div>
                    <div className="text-xs text-gray-500 font-mono select-all">{h.adminEmail}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    h.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {h.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {h.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => toggleStatus(h._id, h.status)}
                    className={`btn btn-xs rounded-lg font-bold border-none transition-colors ${
                      h.status === 'active' ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-green-50 hover:bg-green-100 text-green-600'
                    }`}
                  >
                    {h.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}

            {hospitals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-blue-600" />
                  <p className="font-bold text-gray-700">কোনো হসপিটাল রেকর্ড পাওয়া যায়নি</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHospitals;