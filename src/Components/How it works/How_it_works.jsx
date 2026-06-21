import React from 'react';
import { motion } from 'framer-motion';

const How_it_works = () => {
  const leftSteps = [
    { number: "01", icon: "👤", title: "নিবন্ধন করুন", desc: "DocLine-এ একটি অ্যাকাউন্ট তৈরি করুন অথবা লগইন করুন।" },
    { number: "02", icon: "🏥", title: "হাসপাতাল নির্বাচন করুন", desc: "তালিকা থেকে আপনার পছন্দের হাসপাতাল বা ডায়াগনস্টিক সেন্টার বেছে নিন।" },
    { number: "03", icon: "👨‍⚕️", title: "বিভাগ ও ডাক্তার নির্বাচন করুন", desc: "প্রয়োজন অনুযায়ী বিভাগ (যেমন কার্ডিওলজি, মেডিসিন, শিশু বিভাগ) এবং ডাক্তার নির্বাচন করুন।" }
  ];

  const rightSteps = [
    { number: "04", icon: "📅", title: "অ্যাপয়েন্টমেন্টের অনুরোধ করুন", desc: "সুবিধাজনক তারিখ ও সময় নির্বাচন করে অ্যাপয়েন্টমেন্ট বুক করুন।" },
    { number: "05", icon: "✅", title: "সিরিয়াল নিশ্চিত করুন", desc: "হাসপাতাল কর্তৃপক্ষ আপনার অনুরোধ গ্রহণ করলে একটি নির্দিষ্ট সিরিয়াল নম্বর প্রদান করা হবে।" },
    { number: "06", icon: "📱", title: "লাইভ সিরিয়াল ট্র্যাক করুন", desc: "রিয়েল-টাইমে দেখুন বর্তমান সিরিয়াল, আপনার অবস্থান এবং আনুমানিক অপেক্ষার সময়। ঠিক সময়ে হাসপাতালে পৌঁছে যান।" }
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-full py-10 bg-gradient-to-b from-white via-blue-50/50 to-blue-100/70">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-20">
        
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-slate-800 leading-tight mt-4 mb-5"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            অ্যাপয়েন্টমেন্ট থেকে লাইভ ট্র্যাকিং — <span className="text-blue-600">সবকিছু এক জায়গায়</span>
          </motion.h2>
          <motion.p 
            className="text-slate-500 mt-10 text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            মাত্র কয়েকটি সহজ ধাপে অ্যাপয়েন্টমেন্ট বুক করুন এবং লাইভ সিরিয়াল ট্র্যাক করুন।
          </motion.p>
        </div>

        {/* Two Columns Grid Container */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 -mt-8 gap-6 lg:gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          {/* Left Column (Steps 1-3) */}
          <div className="space-y-6">
            {leftSteps.map((step, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex gap-5 items-start"
              >
                {/* Clean & Professional Number Badge */}
                <div className="w-12 h-12 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold text-lg flex items-center justify-center flex-shrink-0 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Info Text & Icon */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                    <span>{step.icon}</span> {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column (Steps 4-6) */}
          <div className="space-y-6">
            {rightSteps.map((step, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex gap-5 items-start"
              >
                {/* Clean & Professional Number Badge */}
                <div className="w-12 h-12 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold text-lg flex items-center justify-center flex-shrink-0 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Info Text & Icon */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                    <span>{step.icon}</span> {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default How_it_works;