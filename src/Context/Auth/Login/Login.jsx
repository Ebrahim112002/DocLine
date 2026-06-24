import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, HeartPulse } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../AuthContext';
const Login = () => {
  const { loginUser, setLoading } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ইউজার যে পেজ থেকে লগইনে এসেছে, সফল হলে সেখানে পাঠানো (Default: Home)
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await loginUser(email, password);
      
      // সফল লগইন অ্যালার্ট
      Swal.fire({
        title: 'লগইন সফল হয়েছে!',
        text: 'DocLine-এ আপনাকে স্বাগতম।',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
      
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);
      console.error(err);
      // ফায়ারবেস এরর মেসেজ হ্যান্ডলিং
      if (err.code === 'auth/invalid-credential') {
        setError('ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়!');
      } else {
        setError('কোথাও কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন!');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        {/* Top Header Section */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            অ্যাকাউন্টে লগইন করুন
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            আপনার বিশ্বস্ত স্বাস্থ্য সঙ্গী DocLine-এ প্রবেশ করুন
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-sm">আপনার ইমেইল</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="example@mail.com"
                className="input input-bordered input-primary w-full pl-12 pr-4 rounded-2xl focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-control w-full">
            <label className="label py-1 flex justify-between">
              <span className="label-text font-semibold text-sm">পাসওয়ার্ড</span>
              <a href="#" className="label-text-alt link link-hover text-blue-600 font-medium">পাসওয়ার্ড ভুলে গেছেন?</a>
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="input input-bordered input-primary w-full pl-12 pr-4 rounded-2xl focus:outline-none"
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100 text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(37, 99, 235, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-2xl font-semibold text-lg shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              লগইন করুন
            </motion.button>
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-2 border-t border-gray-100 text-sm text-gray-600">
          নতুন ইউজার?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors link link-hover">
            এখানে নিবন্ধন করুন
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;