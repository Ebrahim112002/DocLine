import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <div className="relative w-full h-[80vh] min-h-[620px] max-h-[750px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.ibb.co.com/5hhDZmdd/Gemini-Generated-Image-yerf20yerf20yerf.png')`,
        }}
      />

      {/* Dark Overlay with opacity */}
      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* Content Area */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-end ">
        <motion.div
          className="w-full sm:max-w-[550px] bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-10 shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            হাসপাতালের সিরিয়াল এখন আপনার হাতের মুঠোয়
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            অযথা ঘণ্টার পর ঘণ্টা অপেক্ষা নয়।{' '}
            <span className="font-semibold text-white">DocLine</span>-আপনাকে দেখাবে লাইভ কিউ আপডেট, যাতে হাসপাতালের ভিড়ের মাঝেও আপনি আপনার সিরিয়াল সময়মতো পেতে পারেন। এখনই শুরু করুন এবং আপনার সময় বাঁচান!
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="group mt-8 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-300 text-white font-medium text-base rounded-xl flex items-center gap-2.5 shadow-lg shadow-blue-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            এখনই শুরু করুন
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Soft Shadow (Optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default Banner;