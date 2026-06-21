import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiBell, FiCalendar, FiLayers, FiHeart } from 'react-icons/fi';

const WhyUseUs = () => {
  // কার্ডগুলোর ডেটা এবং আইকন সেটআপ
  const features = [
    {
      icon: <FiClock className="w-6 h-6 text-blue-600" />,
      title: "মূল্যবান সময় বাঁচান",
      desc: "হাসপাতালে ঘণ্টার পর ঘণ্টা অপেক্ষা করার প্রয়োজন নেই। আনুমানিক অপেক্ষার সময় জেনে ঠিক সময়ে পৌঁছান।"
    },
    {
      icon: <FiEye className="w-6 h-6 text-blue-600" />,
      title: "রিয়েল-টাইমে সিরিয়াল দেখুন",
      desc: "আপনার সিরিয়াল এখন কত দূরে, বর্তমানে কোন নম্বর চলছে এবং আর কতক্ষণ অপেক্ষা করতে হবে—সবকিছু এক নজরে দেখুন।"
    },
    {
      icon: <FiBell className="w-6 h-6 text-blue-600" />,
      title: "গুরুত্বপূর্ণ আপডেট কখনো মিস করবেন না",
      desc: "অ্যাপয়েন্টমেন্ট নিশ্চিত হওয়া থেকে শুরু করে আপনার ডাক আসার আগ পর্যন্ত প্রয়োজনীয় নোটিফিকেশন পেয়ে থাকুন সবসময় প্রস্তুত।"
    },
    {
      icon: <FiCalendar className="w-6 h-6 text-blue-600" />,
      title: "সহজ ও ঝামেলামুক্ত অ্যাপয়েন্টমেন্ট",
      desc: "পছন্দের হাসপাতাল, বিভাগ এবং ডাক্তার নির্বাচন করে কয়েকটি ধাপেই অ্যাপয়েন্টমেন্ট সম্পন্ন করুন।"
    },
    {
      icon: <FiLayers className="w-6 h-6 text-blue-600" />,
      title: "এক প্ল্যাটফর্মে একাধিক হাসপাতাল",
      desc: "বিভিন্ন হাসপাতাল ও ডায়াগনস্টিক সেন্টারের সেবা একই জায়গা থেকে গ্রহণ করুন, আলাদা আলাদা প্রক্রিয়ার ঝামেলা ছাড়াই।"
    },
    {
      icon: <FiHeart className="w-6 h-6 text-blue-600" />,
      title: "রোগীকেন্দ্রিক অভিজ্ঞতা",
      desc: "DocLine তৈরি করা হয়েছে রোগীদের বাস্তব সমস্যার কথা মাথায় রেখে—যাতে স্বাস্থ্যসেবা হয় আরও সহজ, স্বচ্ছ এবং নিশ্চিন্ত।"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    // Blue to White Gradient Background
    <div className="w-full py-10 bg-gradient-to-b from-blue-100/70 via-blue-50/30 to-blue-50/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-slate-800 leading-tight"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
             কেন DocLine সবার সেরা পছন্দ?
          </motion.h2>
          <motion.p 
            className="text-slate-600 mt-4 text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            অযথা অপেক্ষা নয়, ঝামেলাহীন স্বাস্থ্যসেবা অভিজ্ঞতা। DocLine আপনাকে সময় বাঁচাতে, অনিশ্চয়তা কমাতে এবং আরও স্মার্টভাবে হাসপাতালের অ্যাপয়েন্টমেন্ট পরিচালনা করতে সাহায্য করে।
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              // গ্লাসোমরফিজম বর্ডার এবং কাস্টম ডিপ ফ্লোটিং শ্যাডো যুক্ত করা হয়েছে এখানে 👇
              className="bg-white border border-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-[0_20px_40px_-15px_rgba(148,163,184,0.12)] flex flex-col gap-5"
            >
              {/* Icon Holder */}
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shadow-inner">
                {feature.icon}
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight Line (Bottom Callout) */}
        <motion.div 
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-block bg-white border border-slate-100 border-l-4 border-l-blue-600 px-6 py-4 rounded-r-2xl max-w-3xl shadow-[0_10px_30px_-10px_rgba(148,163,184,0.08)]">
            <p className="text-base md:text-lg font-medium text-slate-700 italic">
              "কারণ আপনার সময় মূল্যবান, আর স্বাস্থ্যসেবা হওয়া উচিত আরও সহজ।"
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default WhyUseUs;