import React, { useState, useContext } from 'react';
import { Building2, Phone, MapPin, Mail, User, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const AddHospital = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAddHospital = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const hospitalName = form.hospitalName.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const adminName = form.adminName.value;
    const adminEmail = form.adminEmail.value;

    const hospitalData = { hospitalName, phone, address, adminName, adminEmail };
    const token = localStorage.getItem('access-token');

    try {
      const res = await fetch('http://localhost:3000/hospitals/add-hospital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token ? `Bearer ${token}` : '',
          'email': user?.email || ''
        },
        body: JSON.stringify(hospitalData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "হসপিটাল অ্যাড করতে ব্যর্থ হয়েছে!");
      }

      if (data.success) {
        Swal.fire({
          title: 'অভিনন্দন!',
          text: 'হসপিটাল সফলভাবে যুক্ত হয়েছে এবং ইনভাইটেশন পাঠানো হয়েছে।',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        });
        form.reset();
      }
    } catch (error) {
      Swal.fire({
        title: 'এরর!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-sm rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
         <h2 className="text-2xl font-bold text-gray-900">নতুন হসপিটাল যুক্ত করুন (Add Hospital)</h2>
          <p className="text-sm text-gray-500">DocLine প্ল্যাটফর্মে নতুন হসপিটাল এবং তার এডমিন প্রোফাইল তৈরি করুন</p>
        </div>
      </div>

      <form onSubmit={handleAddHospital} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital Name */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700 text-sm">Hospital Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" name="hospitalName" placeholder="e.g. Evercare Hospital" className="input input-bordered w-full pl-11 bg-gray-50/50 focus:bg-white rounded-xl text-sm" required />
            </div>
          </div>

          {/* Hospital Phone */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700 text-sm">Hospital Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" name="phone" placeholder="e.g. 017XXXXXXXX" className="input input-bordered w-full pl-11 bg-gray-50/50 focus:bg-white rounded-xl text-sm" required />
            </div>
          </div>

          {/* Hospital Address */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold text-gray-700 text-sm">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" name="address" placeholder="e.g. Bashundhara, Dhaka" className="input input-bordered w-full pl-11 bg-gray-50/50 focus:bg-white rounded-xl text-sm" required />
            </div>
          </div>

          {/* Divider */}
          <div className="md:col-span-2 border-t border-dashed border-gray-200 my-2 pt-4">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Hospital Admin Credentials</h3>
          </div>

          {/* Admin Name */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700 text-sm">Admin Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" name="adminName" placeholder="e.g. Rahim Ahmed" className="input input-bordered w-full pl-11 bg-gray-50/50 focus:bg-white rounded-xl text-sm" required />
            </div>
          </div>

          {/* Admin Email */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700 text-sm">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input type="email" name="adminEmail" placeholder="e.g. rahim@evercare.com" className="input input-bordered w-full pl-11 bg-gray-50/50 focus:bg-white rounded-xl text-sm" required />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full rounded-xl mt-4 font-bold text-white shadow-md shadow-blue-100" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Submit & Generate Invite"}
        </button>
      </form>
    </div>
  );
};

export default AddHospital;