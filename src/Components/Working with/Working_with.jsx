import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

const Working_with = ({ hospitals = [] }) => {
  if (!hospitals || hospitals.length === 0) return null;

  // ইনফিনিট লুপের জন্য ডেটা ডুপ্লিকেট করা হলো
  const duplicatedHospitals = [...hospitals, ...hospitals, ...hospitals];
  const x = useMotionValue(0);

  useEffect(() => {
    const cardWidth = 300; // প্রতিটি কার্ডের উইডথ
    const gap = 24;        // কার্ডগুলোর মাঝের গ্যাপ
    const totalWidth = hospitals.length * (cardWidth + gap);

    // লিনিয়ার অটো-স্লাইড অ্যানিমেশন
    const controls = animate(x, -totalWidth, {
      ease: "linear",
      duration: hospitals.length * 5, // স্পিড কন্ট্রোল (যত বেশি দিবেন তত আস্তে চলবে)
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controls.stop();
  }, [hospitals, x]);

  return (
    <div className="w-full py-14 bg-slate-50 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-5 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-5">
          যেসব হাসপাতাল ও ডায়াগনস্টিক সেন্টারে DocLine সেবা উপলব্ধ
        </h2>
        <p className="text-slate-500 mt-2">
          আমরা শীর্ষস্থানীয় স্বাস্থ্যসেবা প্রতিষ্ঠানগুলোর সাথে কাজ করছি। আপনার নিকটস্থ হাসপাতালটি খুঁজে বের করুন এবং আমাদের সেবার সুবিধা নিন।
        </p>
      </div>

      {/* Full Width Carousel Wrapper */}
      <div className="w-full relative py-2">
        <motion.div 
          className="flex gap-6"
          style={{ x }}
        >
          {duplicatedHospitals.map((hospital, index) => (
            <div
              key={`${hospital.id}-${index}`}
              className="w-[300px] bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col gap-4 flex-shrink-0"
            >
              {/* Image */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={hospital.image} 
                  alt={hospital.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                  {hospital.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {hospital.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Working_with;