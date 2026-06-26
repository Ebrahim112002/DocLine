import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthContext';
import { UserPlus, UserCheck, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddAssistant = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const assistantData = {
      assistantName: data.assistantName,
      assistantEmail: data.assistantEmail.toLowerCase().trim(),
      phone: data.phone,
      adminEmail: user?.email, // ট্র্যাকিং-এর জন্য এডমিনের ইমেইল
      status: "pending",       // ডিফল্ট স্ট্যাটাস
      role: "assistant",       // ডিফল্ট রোল
      assignedDoctorEmail: "", // শুরুতে কোনো ডক্টর অ্যাসাইন থাকবে না
      assignedDoctorName: "Not Assigned"
    };

    try {
      const response = await fetch('http://localhost:3000/hospitals/assistants/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistantData)
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Assistant Record Created! 🎉',
          text: 'The assistant invitation has been recorded. They can now register using this email.',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          reset();
          navigate('/hospital_admin_dashboard/manageAssistants'); // সরাসরি লিস্ট পেজে নিয়ে যাবে
        });
      } else {
        Swal.fire('Error', result.message || 'Failed to add assistant.', 'error');
      }
    } catch (error) {
      console.error("Error adding assistant:", error);
      Swal.fire('Error', 'Server error. Please try again.', 'error');
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto pb-12">
      {/* Header Panel */}
      <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" /> Add New Assistant
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Create standalone corporate accounts for medical assistants. Mapping can be done later.</p>
        </div>
        <button 
          onClick={() => navigate('/hospital_admin_dashboard/manageAssistants')}
          className="btn btn-sm btn-outline rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          View Assistants List
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Assistant Name */}
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">ASSISTANT FULL NAME *</label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="e.g. Rahim Uddin" 
                className={`input input-bordered w-full pl-9 rounded-xl bg-gray-50/50 ${errors.assistantName ? 'input-error' : ''}`} 
                {...register('assistantName', { required: 'Name is required' })} 
              />
            </div>
            {errors.assistantName && <span className="text-error text-xs mt-1">{errors.assistantName.message}</span>}
          </div>
          
          {/* Assistant Phone */}
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">CONTACT NUMBER *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="tel" 
                placeholder="01XXXXXXXXX" 
                className={`input input-bordered w-full pl-9 rounded-xl bg-gray-50/50 ${errors.phone ? 'input-error' : ''}`} 
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: { value: /^(?:\+88|88)?(01[3-9]\d{8})$/, message: 'Invalid Bangladeshi phone number' }
                })} 
              />
            </div>
            {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
          </div>
        </div>

        {/* Assistant Email */}
        <div className="form-control max-w-md">
          <label className="label font-bold text-gray-700 text-xs mb-1">ASSISTANT EMAIL ADDRESS *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="assistant@hospital.com" 
              className={`input input-bordered w-full pl-9 rounded-xl bg-gray-50/50 ${errors.assistantEmail ? 'input-error' : ''}`} 
              {...register('assistantEmail', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })} 
            />
          </div>
          {errors.assistantEmail && <span className="text-error text-xs mt-1">{errors.assistantEmail.message}</span>}
          <label className="label py-1">
            <span className="label-text-alt text-gray-400 italic">This email will be verified when the assistant registers their account.</span>
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary rounded-xl font-bold flex items-center gap-2 px-6 shadow-md shadow-blue-100 text-white"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <><UserPlus className="w-4 h-4" /> Save & Invite Assistant</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddAssistant;