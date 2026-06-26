import React, { useEffect, useState, useContext } from 'react';
import { Users, Shield, Trash2, UserCheck, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext'; 

const ManageUsers = () => {
  const { user } = useContext(AuthContext); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. সব ইউজার গেট করার মূল ফাংশন
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access-token'); // প্রতিবার রিকোয়েস্টের সময় লেটেস্ট টোকেন নেওয়া হবে

      const res = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? `Bearer ${token}` : '',
          'email': user?.email || '',          
          'x-user-email': user?.email || ''  
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error Code: ${res.status}`);
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      Swal.fire({
        title: 'ডাটা লোড করা যায়নি!',
        text: error.message || 'সার্ভার রেসপন্স করছে না। ব্যাকএন্ড চেক করুন।',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  // ইউজার ইমেইল এভেলেবল হলেই ডাটা ফেচ হবে
  useEffect(() => {
    if (user?.email) {
      fetchUsers();
    }
  }, [user?.email]);

  // ২. রোল পরিবর্তন (Make Admin / Make Regular User)
  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const token = localStorage.getItem('access-token');
    
    Swal.fire({
      title: `রোল পরিবর্তন করতে চান?`,
      text: `ইউজারটিকে '${newRole}' রোলে সেট করা হবে!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, পরিবর্তন করুন!',
      cancelButtonText: 'বাতিল'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'authorization': token ? `Bearer ${token}` : '',
              'email': user?.email || '',
              'x-user-email': user?.email || ''
            },
            body: JSON.stringify({ role: newRole })
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'রোল আপডেট করতে ব্যর্থ।');
          }

          Swal.fire('সফল হয়েছে!', 'ইউজারের রোল আপডেট করা হয়েছে।', 'success');
          fetchUsers(); // লিস্ট রিফ্রেশ
        } catch (error) {
          Swal.fire('অ্যাকশন রিজেক্টেড!', error.message, 'error');
        }
      }
    });
  };

  // ৩. ইউজার ডিলিট করা
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('access-token');

    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "এই ইউজারটিকে স্থায়ীভাবে ডিলিট করা হবে!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
      cancelButtonText: 'বাতিল'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': token ? `Bearer ${token}` : '',
              'email': user?.email || '',
              'x-user-email': user?.email || ''
            }
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'ইউজার ডিলিট করতে ব্যর্থ।');
          }

          Swal.fire('ডিলিট হয়েছে!', 'ইউজার সফলভাবে রিমুভ করা হয়েছে।', 'success');
          fetchUsers(); // লিস্ট রিফ্রেশ
        } catch (error) {
          Swal.fire('ভুল হয়েছে!', error.message, 'error');
        }
      }
    });
  };

  // লোডিং স্ক্রিন
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="text-gray-500 font-medium text-sm animate-pulse">ইউজার ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* টপ বার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ইউজার ম্যানেজমেন্ট</h2>
            <p className="text-sm text-gray-500">DocLine প্ল্যাটফর্মের সকল নিবন্ধিত মেম্বারদের তালিকা</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl self-start sm:self-center">
          <span className="text-sm font-medium text-gray-600">মোট ইউজার: </span>
          <span className="text-base font-bold text-blue-600">{users.length} জন</span>
        </div>
      </div>

      {/* ইউজার টেবিল */}
      <div className="overflow-x-auto w-full rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="table table-zebra w-full text-left border-collapse">
          <thead className="bg-gray-50/75 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="py-4 px-6">ইউজার প্রোফাইল</th>
              <th className="py-4 px-6">ইমেইল অ্যাড্রেস</th>
              <th className="py-4 px-6">রোল (Role)</th>
              <th className="py-4 px-6">স্ট্যাটাস</th>
              <th className="py-4 px-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          
          <tbody className="text-gray-600 text-sm font-medium">
            {users.map((u, index) => (
              <tr key={u._id || index} className="hover:bg-blue-50/20 transition-colors border-b border-gray-100 last:border-none">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring-2 ring-gray-100">
                        <img 
                          src={u.photoURL || "https://i.ibb.co/6R7Y7Z1/default-avatar.png"} 
                          alt={u.name || "User"} 
                          onError={(e) => { e.target.src = "https://i.ibb.co/6R7Y7Z1/default-avatar.png" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 truncate max-w-[180px]">{u.name || 'নাম নেই'}</div>
                      <div className="text-[11px] text-gray-400 font-mono select-all">UID: {u.uid?.slice(0, 10) || 'N/A'}...</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6 font-mono text-gray-500 select-all">{u.email}</td>

                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${
                    u.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {u.status || 'Active'}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <div className="flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handleRoleChange(u._id, u.role)}
                      className={`btn btn-sm btn-square rounded-xl border border-gray-100 transition-all ${
                        u.role === 'admin' 
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' 
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                      }`}
                      title={u.role === 'admin' ? "Make Regular User" : "Make Admin"}
                    >
                      {u.role === 'admin' ? <UserCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>

                    <button 
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn btn-sm btn-square bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-gray-100 transition-colors"
                      title="Delete User From Database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-16 text-gray-400 bg-gray-50/30">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-blue-600" />
                  <p className="font-bold text-gray-700">কোনো ইউজার তথ্য পাওয়া যায়নি</p>
                  <p className="text-xs text-gray-400 mt-1">ডাটাবেজে কোনো ডেটা নেই অথবা অথেন্টিকেশন এরর হয়েছে।</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;