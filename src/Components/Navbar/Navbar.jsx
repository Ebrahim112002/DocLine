import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, User, UserPlus, ChevronDown, 
  Home, Stethoscope, Building2, Layers, Calendar, 
  HeartPulse, Info, PhoneCall, LayoutDashboard, LogOut 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import Logo from '../../hook/Logo';


const MotionNavLink = motion(NavLink);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  console.log("Current User:", user); // Debugging line to check user state

  // Dynamic Dashboard Route based on Role
const getDashboardRoute = () => {
  if (!user?.role) return '/dashboard';

  const role = user.role.toLowerCase();

  if (role === 'admin') return '/admin_dashboard';
  if (role === 'hospital_admin') return '/hospital_admin_dashboard';
  if (role === 'doctor') return '/dashboard';
  if (role === 'assistant') return '/assis_dashboard';
  return '/user_dashboard';
};

  // Animations Variants (unchanged)
  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, height: "auto", 
      transition: { height: { duration: 0.4, ease: "easeInOut" }, staggerChildren: 0.05, delayChildren: 0.1 } 
    },
    exit: { opacity: 0, height: 0, transition: { height: { duration: 0.3, ease: "easeInOut" }, opacity: { duration: 0.2 } } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      if (logout) {
        await logout();
        setIsOpen(false);
        navigate('/');
      }
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[92%] mx-auto px-4 sm:px-6" >
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left - Logo */}
         <Logo></Logo>

          {/* Center - Navigation Links (unchanged) */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
            {/* ... your existing navigation links ... */}
            <MotionNavLink 
              whileHover={{ y: -2 }} to="/" 
              className={({ isActive }) => `flex items-center gap-2 font-medium text-[15px] transition-colors group whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              <Home className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              <span>হোম</span>
            </MotionNavLink>

            {/* সেবাসমূহ ড্রপডাউন - unchanged */}
            <div className="relative group py-2">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium text-[15px] whitespace-nowrap">
                <Layers className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span>সেবাসমূহ</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              
              <div className="absolute top-full left-0 mt-1 pt-2 w-60 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <motion.div initial="hidden" whileInView="visible" variants={dropdownVariants} className="bg-white rounded-2xl shadow-xl p-3 border border-gray-100">
                  <MotionNavLink whileHover={{ x: 4 }} to="/allDoctors" className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50/60 hover:text-blue-600">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-sm font-medium">ডাক্তার খুঁজুন</span>
                  </MotionNavLink>
                  <MotionNavLink whileHover={{ x: 4 }} to="/hospitals" className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50/60 hover:text-blue-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">হাসপাতাল খুঁজুন</span>
                  </MotionNavLink>
                </motion.div>
              </div>
            </div>

            {/* Other links unchanged */}
            <MotionNavLink whileHover={{ y: -2 }} to="/allDoctors" className={({ isActive }) => `flex items-center gap-2 font-medium text-[15px] transition-colors group whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              <Calendar className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              <span>অ্যাপয়েন্টমেন্ট নিন</span>
            </MotionNavLink>

            <MotionNavLink whileHover={{ y: -2 }} to="/advice" className={({ isActive }) => `flex items-center gap-2 font-medium text-[15px] transition-colors group whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              <HeartPulse className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              <span>স্বাস্থ্য পরামর্শ</span>
            </MotionNavLink>

            <MotionNavLink whileHover={{ y: -2 }} to="/about" className={({ isActive }) => `flex items-center gap-2 font-medium text-[15px] transition-colors group whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              <Info className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              <span>আমাদের সম্পর্কে</span>
            </MotionNavLink>

            <MotionNavLink whileHover={{ y: -2 }} to="/contact" className={({ isActive }) => `flex items-center gap-2 font-medium text-[15px] transition-colors group whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              <PhoneCall className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              <span>যোগাযোগ</span>
            </MotionNavLink>
          </div>

          {/* Right Side - Search + Dynamic Auth */}
          <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Search Button (unchanged) */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }} onClick={() => setSearchOpen(!searchOpen)}
                className={`p-3 rounded-2xl transition-colors ${searchOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -10 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 z-50 origin-top-right"
                  >
                    <input 
                      type="text" 
                      placeholder="ডাক্তার, হাসপাতাল বা বিভাগ খুঁজুন..." 
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" 
                      autoFocus 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Auth - Dynamic Dashboard */}
            {user ? (
              <>
                <NavLink to={getDashboardRoute()}>
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }} 
                    className="hidden md:flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium whitespace-nowrap"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-600" />
                    ড্যাশবোর্ড
                  </motion.button>
                </NavLink>

                <motion.button 
                  onClick={handleLogOut} 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap"
                >
                  <LogOut className="w-5 h-5" />
                  লগআউট
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden md:flex items-center gap-2 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl font-medium whitespace-nowrap">
                    <User className="w-5 h-5 text-gray-400" />
                    লগইন
                  </motion.button>
                </NavLink>

                <NavLink to="/register">
                  <motion.button whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(37, 99, 235, 0.2)" }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold whitespace-nowrap">
                    <UserPlus className="w-5 h-5" />
                    <span>নিবন্ধন করুন</span>
                  </motion.button>
                </NavLink>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 hover:bg-gray-100 rounded-2xl text-gray-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Also Updated with Dynamic Dashboard */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial="hidden" animate="visible" exit="exit" variants={mobileMenuVariants} className="lg:hidden overflow-hidden bg-white border-t">
            <div className="px-6 pt-4 pb-8 space-y-1">
              {/* ... your existing mobile links ... */}

              {/* Mobile Auth Actions */}
              <motion.div variants={itemVariants} className="pt-6 px-5 flex flex-col gap-3">
                {user ? (
                  <>
                    <NavLink to={getDashboardRoute()} onClick={() => setIsOpen(false)} className="w-full">
                      <button className="w-full py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        ড্যাশবোর্ড
                      </button>
                    </NavLink>
                    <button 
                      onClick={handleLogOut}
                      className="w-full py-4 text-lg font-semibold bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-md flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      লগআউট করুন
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <button className="w-full py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        লগইন করুন
                      </button>
                    </NavLink>
                    <NavLink to="/register" onClick={() => setIsOpen(false)} className="w-full">
                      <button className="w-full py-4 text-lg font-semibold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        নিবন্ধন করুন
                      </button>
                    </NavLink>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;