import { HeartPulse } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

const Logo = () => {

  const navigate = useNavigate();
  return (
    <div>
      {/* Logo & Brand Name Block */}
<div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
  <div className="relative">
    {/* Dynamic Breathing HeartPulse Icon acting as the Animated Visual Logo */}
    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-40 animate-pulse"></div>
    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300 border border-white/20">
      <HeartPulse className="w-6 h-6 text-white animate-bounce" style={{ animationDuration: '3s' }} />
    </div>
  </div>
  <div className="flex flex-col">
    <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-900 bg-clip-text text-transparent tracking-tight">
      DocLine
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest -mt-1">
      Smart Health
    </span>
  </div>
</div>
    </div>
  );
};

export default Logo;