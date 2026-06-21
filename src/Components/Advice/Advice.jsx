import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAlertTriangle, FiSearch } from 'react-icons/fi';

const Advice = () => {
  // ক্যাটাগরি ফিল্টারের জন্য স্টেট
  const [activeCategory, setActiveCategory] = useState("সবগুলো");

  // লক্ষণ অনুযায়ী বিভাগ (Categories)
  const categories = ["সবগুলো", "সাধারণ রোগ", "হৃদরোগ ও পুষ্টি", "শিশু স্বাস্থ্য", "মানসিক স্বাস্থ্য"];

  // ৮-১০টি বাস্তবসম্মত হেলথ টিপস কার্ড ডেটা
  const tips = [
    {
      id: 1,
      category: "সাধারণ রোগ",
      emoji: "🦟",
      title: "ডেঙ্গু প্রতিরোধে ৫টি গুরুত্বপূর্ণ করণীয়",
      desc: "বর্ষাকালে ডেঙ্গু থেকে নিজেকে ও পরিবারকে সুরক্ষিত রাখতে ঘরের চারপাশ পরিষ্কার রাখুন এবং এই সহজ পরামর্শগুলো অনুসরণ করুন।"
    },
    {
      id: 2,
      category: "হৃদরোগ ও পুষ্টি",
      emoji: "❤️",
      title: "হৃদরোগের প্রাথমিক লক্ষণ ও সচেতনতা",
      desc: "কখন দ্রুত চিকিৎসকের শরণাপন্ন হওয়া জরুরি? বুক ধড়ফড় বা বাম বাহুতে ব্যথার মতো গুরুত্বপূর্ণ লক্ষণগুলো অবহেলা করবেন না।"
    },
    {
      id: 3,
      category: "সাধারণ রোগ",
      emoji: "🤧",
      title: "ঋতু পরিবর্তনের সর্দি-কাশি হলে কী করবেন?",
      desc: "আবহাওয়া পরিবর্তনের সময় ঠান্ডা লাগলে ঘরোয়া উপায়ে কীভাবে যত্ন নেবেন এবং কখন ডাক্তারের কাছে যাবেন তা জেনে নিন।"
    },
    {
      id: 4,
      category: "হৃদরোগ ও পুষ্টি",
      emoji: "💧",
      title: "তীব্র গরমে ডিহাইড্রেশন এড়ানোর সহজ উপায়",
      desc: "শরীরে পানির ঘাটতি মেটাতে প্রতিদিন পর্যাপ্ত তরল খাবার ও স্যালাইন পানের পাশাপাশি কোন বিষয়গুলো খেয়াল রাখা উচিত।"
    },
    {
      id: 5,
      category: "হৃদরোগ ও পুষ্টি",
      emoji: "🩸",
      title: "ডায়াবেটিস রোগীদের দৈনন্দিন যত্ন ও নিয়মাবলী",
      desc: "রক্তে শর্করার মাত্রা নিয়ন্ত্রণে রাখতে প্রতিদিনের হাঁটাচলা, সঠিক সময়ে খাবার গ্রহণ এবং নিয়মিত চেকআপের গাইডলাইন।"
    },
    {
      id: 6,
      category: "কোনো শারীরিক সমস্যার ক্ষেত্রে অবশ্যই নিবন্ধিত চিকিৎসকের পরামর্শ গ্রহণ করুন।",
      categor: "কমবয়সী ও প্রবীণ",
      emoji: "👶",
      title: "শিশুদের হঠাৎ তীব্র জ্বর হলে করণীয়",
      desc: "শিশুর শরীরের তাপমাত্রা বাড়লে আতঙ্কিত না হয়ে প্রাথমিক অবস্থায় জলপট্টি দেওয়া ও সঠিক ওষুধ নির্বাচনের নিয়ম।"
    },
    {
      id: 7,
      category: "মানসিক স্বাস্থ্য",
      emoji: "🧠",
      title: "কর্মব্যস্ত জীবনে মানসিক চাপ কমানোর সহজ উপায়",
      desc: "মানসিক অবসাদ ও অতিরিক্ত চিন্তা দূর করতে ডিপ ব্রিথিং, মেডিটেশন এবং ডিজিটাল ডিটক্স কীভাবে সাহায্য করে।"
    },
    {
      id: 8,
      category: "হৃদরোগ ও পুষ্টি",
      emoji: "🍎",
      title: "সুস্থ শরীরের জন্য পুষ্টিকর ও স্বাস্থ্যকর খাদ্যাভ্যাস",
      desc: "রোগ প্রতিরোধ ক্ষমতা বাড়াতে প্রতিদিনের খাদ্যতালিকায় অ্যান্টি-অক্সিডেন্ট, শাকসবজি ও ফলমূল রাখার উপকারিতা।"
    }
  ];

  // ক্যাটাগরি অনুযায়ী কার্ড ফিল্টার করার লজিক
  const filteredTips = activeCategory === "সবগুলো" 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-full py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden relative">
      
      {/* Background Soft Blobs */}
      <div className="absolute top-[5%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Headline Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-emerald-600 font-bold text-sm tracking-wider uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
          >
            🩺 সুস্থ থাকুন, সচেতন থাকুন
          </motion.span>
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight mt-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            স্বাস্থ্য বিষয়ক নির্ভরযোগ্য পরামর্শ ও সচেতনতামূলক তথ্য জানুন সহজ ভাষায়।
          </motion.h2>
        </div>

        {/* Extra Feature: Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tips / Articles Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {filteredTips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={cardVariants}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_15px_35px_-15px_rgba(148,163,184,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] transition-all duration-300 group"
            >
              <div className="flex flex-col gap-4">
                {/* Emoji Indicator */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-sm">
                  {tip.emoji}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-50/70 px-2.5 py-1 rounded-md">
                    {tip.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 pt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {tip.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {tip.desc}
                  
                  </p>
                </div>
              </div>

              {/* Action Link (Route path template ready) */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a 
                  href={`/health-tips/${tip.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  বিস্তারিত পড়ুন 
                  <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State if no items match filter */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12 text-slate-400">এই বিভাগে আপাতত কোনো পরামর্শ নেই।</div>
        )}

        {/* Medical Disclaimer Section ⚠️ */}
        <motion.div 
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-amber-50/60 backdrop-blur-sm border border-amber-200/70 rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/20">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-amber-800 text-base">সতর্কতা ও ঘোষণা (Disclaimer)</h4>
              <p className="text-amber-700 text-xs md:text-sm leading-relaxed font-medium">
                এই পরামর্শগুলো শুধুমাত্র সচেতনতামূলক উদ্দেশ্যে প্রদান করা হয়েছে। কোনো শারীরিক সমস্যার ক্ষেত্রে অবশ্যই নিবন্ধিত চিকিৎসকের পরামর্শ গ্রহণ করুন।
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Advice;