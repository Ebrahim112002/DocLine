import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'; 
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const IMGBB_API_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const onSubmit = async (data) => {
    console.log(data);
    try {
      let imageUrl = null;

      /* ==== ১. ইমেজ আপলোড লজিক (ImgBB) ==== */
      if (data.image && data.image[0]) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
          const imgbbResponse = await axios.post(IMGBB_API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', 
            },
          });

          console.log("ImgBB Response Details:", imgbbResponse.data);

          if (imgbbResponse.data.success) {
            imageUrl = imgbbResponse.data.data.display_url;
          }
        } catch (imgError) {
          console.error("ImgBB Upload API Error:", imgError.response?.data || imgError.message);
        } finally {
          setUploading(false);
        }
      }

      /* ==== ২. ফায়ারবেস সাইনআপ + ব্যাকএন্ড সিঙ্ক (একসাথে) ==== */
      // AuthProvider-এর createUser-ই ফায়ারবেস শেষ করে ব্যাকএন্ডের /users এ ডেটা পাঠিয়ে দিবে
      const firebaseResult = await createUser(data.email, data.password, data.name, imageUrl || "");

      /* ==== ৩. সাকসেস হ্যান্ডলিং ও রিডাইরেকশন ==== */
      if (firebaseResult) {
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been created successfully! 🎉',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          reset(); 
          navigate('/'); // লগইন সাকসেসফুল হলে হোম পেজ বা ড্যাশবোর্ডে নিয়ে যাবে
        });
      }

    } catch (error) {
      setUploading(false);
      console.error("Registration Error:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong during registration!',
        icon: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-6 sm:p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">Register Your Account</h2>
            <p className="text-sm text-gray-500 mt-1">Get started by creating your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* ১. ফুল নাম */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold text-sm">Full Name *</span></label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered input-md w-full ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
            </div>

            {/* ২. প্রোফাইল পিকচার */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold text-sm">Profile Picture</span></label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full file-input-md"
                {...register('image')}
              />
            </div>

            {/* ৩. ইমেইল */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold text-sm">Email Address *</span></label>
              <input
                type="email"
                placeholder="example@docline.com"
                className={`input input-bordered input-md w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* ৪. পাসওয়ার্ড */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold text-sm">Password *</span></label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered input-md w-full ${errors.password ? 'input-error' : ''}`}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* ৫. ফোন নম্বর */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold text-sm">Phone Number</span></label>
              <input
                type="tel"
                placeholder="+8801XXXXXXXXX"
                className="input input-bordered input-md w-full"
                {...register('phone')}
              />
            </div>

            {/* ৬. জেন্ডার এবং ডেট অফ বার্থ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold text-sm">Gender</span></label>
                <select className="select select-bordered select-md w-full" {...register('gender')}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold text-sm">Date of Birth</span></label>
                <input
                  type="date"
                  className="input input-bordered input-md w-full"
                  {...register('dateOfBirth')}
                />
              </div>
            </div>

            {/* সাবমিট বাটন */}
            <div className="form-control pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting || uploading} 
                className="btn btn-primary w-full text-white font-bold"
              >
                {isSubmitting || uploading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Register Account'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;