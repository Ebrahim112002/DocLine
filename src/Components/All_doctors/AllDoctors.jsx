// src/components/Public/AllDoctors.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const AllDoctors = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Booking Execution Overlay States
  const [activeBookingDoctor, setActiveBookingDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientProblem, setPatientProblem] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false);

  useEffect(() => {
    fetchActiveDoctors();
  }, []);

  const fetchActiveDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/hospital-public/all-doctors');
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error("Error loading registry data setup:", err);
    } finally {
      setLoading(false);
    }
  };

  // Unique specialty categorization logic filter parsing
  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  // Dynamic filter logic computing grid array pipeline
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBookingModal = (doctor) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to your account before scheduling standard checkups.',
      });
      return;
    }
    setActiveBookingDoctor(doctor);
    // Auto preset values initialization matching structure setup
    setPatientName('');
    setPatientAge('');
    setPatientGender('');
    setPatientPhone('');
    setPatientProblem('');
    setAppointmentDate('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!activeBookingDoctor) return;

    setBookingSubmitLoading(true);

    // Bookings engine strict structure mapping interface standard sync logic
    const bookingPayload = {
      hospitalId: activeBookingDoctor.hospitalId,
      hospitalName: activeBookingDoctor.hospitalName,
      bookingType: "doctor",
      appointmentDate,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      patientProblem,
      selectedDoctor: {
        doctorName: activeBookingDoctor.doctorName,
        doctorEmail: activeBookingDoctor.doctorEmail,
        visitFee: activeBookingDoctor.visitFee,
        specialty: activeBookingDoctor.specialty
      },
      selectedTests: [],
      totalAmount: activeBookingDoctor.visitFee
    };

    try {
      const response = await axios.post('http://localhost:3000/bookings/create', bookingPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Custom auth mapping pattern injection logic
          'email': user?.email
        }
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Placed Successfully!',
          text: 'Hospital Admin will process your confirmation and issue live tracking queues.',
        });
        setActiveBookingDoctor(null); // Modal close action trigger
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'Something went wrong inside server pipeline'
      });
    } finally {
      setBookingSubmitLoading(false);
    }
  };

  if (loading) return <div className="text-center py-24 font-black text-gray-400 text-xs">Synchronizing Specialists Feed...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* 🚀 BANNER HEADER */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-950 p-8 rounded-3xl text-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-black">Find Specialists & Schedule Instantly 🩺</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Search across multiple integrated medical centers, select your certified specialist and securely place online registries token instantly.
        </p>
      </div>

      {/* 🔍 FILTER CONTROL BLOCK */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <input 
          type="text"
          placeholder="Search by Doctor Name or Clinical Station..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-slate-50 border p-3 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="md:w-64 bg-slate-50 border p-3 rounded-xl text-xs font-bold capitalize focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec === 'all' ? '💼 Filter By Specialty' : spec}</option>
          ))}
        </select>
      </div>

      {/* 🧬 DOCTORS GRID VIEW LIST PANEL */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 text-xs font-bold text-gray-400 border border-dashed rounded-3xl bg-white">
          No certified active specialists matched your configured parameter constraints.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl border p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <img 
                    src={doc.image || "https://placeholder.co/150"} 
                    alt={doc.doctorName} 
                    className="w-14 h-14 object-cover rounded-xl bg-slate-100 border"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">{doc.doctorName}</h3>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {doc.specialty}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5 pt-2 border-t text-xs text-slate-600">
                  <p>🎓 <span className="font-semibold">{doc.primaryDegree}</span></p>
                  <p>🏥 Hospital: <span className="font-bold text-indigo-950">{doc.hospitalName}</span></p>
                  <p className="text-[11px] text-slate-400">📍 Location: {doc.hospitalAddress}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Fee</p>
                  <p className="text-base font-black text-emerald-600">৳ {doc.visitFee}</p>
                </div>
                <button
                  onClick={() => handleOpenBookingModal(doc)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📝 CORE APPOINTMENT SUBMITTING OVERLAY MODAL */}
      {activeBookingDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-black text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-900">Desk Terminal</span>
                <h2 className="text-base font-black mt-1">Schedule Appointment Session</h2>
              </div>
              <button 
                onClick={() => setActiveBookingDoctor(null)} 
                className="text-slate-400 hover:text-white font-black text-lg p-1.5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Doctor Details Mapping Summary */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-xs text-slate-700">
                <p>🩺 Target Physician: <b>{activeBookingDoctor.doctorName} ({activeBookingDoctor.specialty})</b></p>
                <p className="mt-1">🏥 Station: <b>{activeBookingDoctor.hospitalName}</b></p>
                <p className="mt-1">💳 Terminal Total Amount: <b className="text-emerald-600 text-sm">৳ {activeBookingDoctor.visitFee}</b></p>
              </div>

              {/* Form Input Controllers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Patient Full Name *</label>
                  <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Patient Active Phone *</label>
                  <input type="tel" required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Patient Age *</label>
                  <input type="number" required value={patientAge} onChange={(e) => setPatientAge(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Gender *</label>
                  <select required value={patientGender} onChange={(e) => setPatientGender(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Preferred Date *</label>
                  <input type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Symptoms / Case History</label>
                <textarea rows="2" value={patientProblem} onChange={(e) => setPatientProblem(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Describe clinical symptoms context..." />
              </div>

              <button
                type="submit"
                disabled={bookingSubmitLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl text-xs tracking-wide transition-all disabled:bg-slate-300"
              >
                {bookingSubmitLoading ? 'Processing Placement Request Engine...' : 'Confirm System Booking Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDoctors;