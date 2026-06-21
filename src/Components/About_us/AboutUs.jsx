import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart, FiClock, FiShield, FiCpu } from 'react-icons/fi';

const AboutUs = () => {
  const values = [
    { icon: <FiHeart className="w-5 h-5 text-rose-500" />, text: "রোগীকেন্দ্রিক সেবা" },
    { icon: <FiClock className="w-5 h-5 text-amber-500" />, text: "সময়ের মূল্যায়ন" },
    { icon: <FiShield className="w-5 h-5 text-emerald-500" />, text: "স্বচ্ছতা ও নির্ভরযোগ্যতা" },
    { icon: <FiCpu className="w-5 h-5 text-blue-500" />, text: "উদ্ভাবন ও প্রযুক্তিনির্ভর সমাধান" }
  ];

  const scrollAnimationConfig = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="w-full py-20 bg-white overflow-hidden relative">
      
      {/* Background soft gradient behind text for premium look */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/20 via-indigo-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container with custom internal padding for perfect structure */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Centered Main Title Area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-blue-600 tracking-wide uppercase mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            আমাদের সম্পর্কে
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-800 leading-snug mt-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
          >
            প্রযুক্তির মাধ্যমে স্বাস্থ্যসেবাকে আরও <span className="text-blue-600">সহজ, স্বচ্ছ এবং সময় সাশ্রয়ী</span> করে তোলাই আমাদের লক্ষ্য।
          </motion.p>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Side: Story Text with Subtle Bottom Gradient Background Accent */}
          <motion.div 
            className="flex flex-col gap-5 relative bg-slate-50/40 p-6 md:p-8 rounded-2xl border border-slate-100 backdrop-blur-sm"
            {...scrollAnimationConfig}
          >
            <div className="space-y-4 text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed z-10">
              <p>
                <strong className="text-slate-800 font-semibold">DocLine</strong> একটি স্বাস্থ্যসেবা প্ল্যাটফর্ম, যা রোগীদের হাসপাতালের দীর্ঘ অপেক্ষা এবং অনিশ্চয়তার অভিজ্ঞতা কমানোর উদ্দেশ্যে তৈরি করা হয়েছে।
              </p>
              <p>
                আমরা বিশ্বাস করি, স্বাস্থ্যসেবা পাওয়ার জন্য ঘণ্টার পর ঘণ্টা লাইনে দাঁড়িয়ে থাকা বা বারবার কাউন্টারে গিয়ে সিরিয়ালের খোঁজ নেওয়া উচিত নয়। তাই আমরা নিয়ে এসেছি এমন একটি সমাধান, যেখানে রোগীরা সহজেই অ্যাপয়েন্টমেন্ট বুক করতে পারবেন, নির্দিষ্ট সিরিয়াল নম্বর পেতে পারবেন এবং রিয়েল-টাইমে তাদের সিরিয়ালের বর্তমান অবস্থা ট্র্যাক করতে পারবেন।
              </p>
              <p>
                DocLine-এর মাধ্যমে আমরা রোগীদের মূল্যবান সময় বাঁচাতে, হাসপাতালের কিউ ব্যবস্থাপনাকে আরও কার্যকর করতে এবং স্বাস্থ্যসেবা গ্রহণের পুরো প্রক্রিয়াকে আরও স্বচ্ছ ও ঝামেলামুক্ত করতে কাজ করছি।
              </p>
              <p>
                আমাদের লক্ষ্য শুধু একটি প্রযুক্তি প্ল্যাটফর্ম তৈরি করা নয়; বরং এমন একটি ভবিষ্যৎ গড়ে তোলা, যেখানে স্বাস্থ্যসেবা হবে আরও সহজলভ্য, স্মার্ট এবং সবার জন্য আরও মানবিক।
              </p>
            </div>
          </motion.div>

          {/* Right Side: Image Grid/Frame */}
          <motion.div 
            className="w-full flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-md">
              <img 
                src="https://i.ibb.co.com/4RJVp6nx/image.png" 
                alt="DocLine Healthcare Solution" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>

        {/* Middle Section: Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          
          {/* Mission Card */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50/40 via-white to-white p-6 md:p-8 rounded-2xl border border-blue-100/40 flex gap-5 items-start shadow-sm"
            {...scrollAnimationConfig}
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
              <FiTarget className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800">🎯 আমাদের লক্ষ্য (Mission)</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                রোগীদের জন্য অপেক্ষার সময় কমিয়ে স্বাস্থ্যসেবা গ্রহণের অভিজ্ঞতাকে আরও সহজ ও কার্যকর করে তোলা।
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-50/40 via-white to-white p-6 md:p-8 rounded-2xl border border-indigo-100/40 flex gap-5 items-start shadow-sm"
            {...scrollAnimationConfig}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/20">
              <FiEye className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800">👁️ আমাদের স্বপ্ন (Vision)</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                বাংলাদেশের প্রতিটি হাসপাতাল ও স্বাস্থ্যসেবা প্রতিষ্ঠানে স্মার্ট কিউ ম্যানেজমেন্ট ব্যবস্থা পৌঁছে দেওয়া, যাতে প্রতিটি মানুষ সময়মতো এবং নিশ্চিন্তে স্বাস্থ্যসেবা গ্রহণ করতে পারে।
              </p>
            </div>
          </motion.div>

        </div>

        {/* Bottom Section: Values & Trust Callout */}
        <div className="flex flex-col items-center gap-16 border-t border-slate-100 pt-16">
          
          {/* Values Row */}
          <motion.div 
            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {values.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
                }}
                className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex items-center gap-3 justify-center text-center shadow-2xl shadow-slate-100/10"
              >
                {item.icon}
                <span className="font-semibold text-slate-700 text-sm md:text-base">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlight Trust Callout */}
          <motion.div 
            className="text-center w-full max-w-2xl"
            {...scrollAnimationConfig}
          >
            <div className="inline-block bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-transparent border-l-4 border-blue-600 px-6 py-4 rounded-r-xl">
              <p className="text-base md:text-lg font-bold text-slate-800 tracking-wide">
                "DocLine — অপেক্ষা নয়, নিশ্চিন্ত স্বাস্থ্যসেবার পথে আপনার বিশ্বস্ত সঙ্গী।"
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default AboutUs;