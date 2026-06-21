import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <span className="text-2xl font-bold text-white tracking-wide">
              Doc<span className="text-blue-500">Line</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Connecting patients to healthcare, anytime, anywhere. নির্ভরযোগ্য স্বাস্থ্যসেবা এখন আপনার হাতের মুঠোয়।
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            {[
              { icon: <FaFacebookF />, link: "#" },
              { icon: <FaLinkedinIn />, link: "#" },
              { icon: <FaTwitter />, link: "#" },
              { icon: <FaInstagram />, link: "#" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 text-slate-400 text-sm"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-sm">Our Services</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {["Doctor Appointments", "Online Consultations", "Health Records", "Pharmacy", "Insurance Plans"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-500 transition-colors duration-200">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-sm">Quick Links</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {["About Us", "Contact Us", "Careers", "Blog & Articles", "FAQ"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-500 transition-colors duration-200">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-sm">Get In Touch</h3>
          <ul className="flex flex-col gap-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
              <span>123 Health Ave, Medical City, Dhaka, 1212</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-500 flex-shrink-0" />
              <a href="tel:+88017XXXXXXXX" className="hover:text-blue-500 transition-colors">+880 17XX XXX XXX</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500 flex-shrink-0" />
              <a href="mailto:info@docline.com" className="hover:text-blue-500 transition-colors">info@docline.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DocLine Healthcare Solutions. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;