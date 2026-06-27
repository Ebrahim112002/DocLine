import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const HospitalDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');

  // Booking States
  const [bookingType, setBookingType] = useState(null);
  const [chosenDoctor, setChosenDoctor] = useState(null);
  const [chosenTests, setChosenTests] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/hospital-public/details/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hospital details:", err);
        setError('Hospital details load করতে সমস্যা হয়েছে!');
        setLoading(false);
      }
    };

    if (id) fetchHospitalDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-500">Loading Profile Details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center my-16 p-6 text-red-500 font-semibold">{error || 'No data found.'}</div>
    );
  }

  const { hospital, doctors, tests } = data;

  // Debug: Hospital ID চেক
  console.log("Current Hospital ID:", hospital?._id);

  const handleTestCheckboxChange = (test) => {
    setBookingType('test');
    setChosenDoctor(null);
    if (chosenTests.some(t => t._id === test._id)) {
      setChosenTests(chosenTests.filter(t => t._id !== test._id));
    } else {
      setChosenTests([...chosenTests, test]);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setBookingType('doctor');
    setChosenTests([]);
    setChosenDoctor(doctor);
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const calculateTotal = () => {
    if (bookingType === 'doctor' && chosenDoctor) return chosenDoctor.visitFee;
    if (bookingType === 'test') return chosenTests.reduce((sum, test) => sum + test.testFee, 0);
    return 0;
  };
const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !patientPhone || !appointmentDate) {
      alert("Please fill in all patient details!");
      return;
    }

    if (bookingType === 'doctor' && !chosenDoctor) {
      alert("Please select a doctor.");
      return;
    }
    if (bookingType === 'test' && chosenTests.length === 0) {
      alert("Please select at least one test.");
      return;
    }

    setBookingSubmitLoading(true);

    try {
      const payload = {
        // এখানে পরিবর্তন করা হয়েছে: hospital._id এর পরিবর্তে hospital.hospitalId ব্যবহার হচ্ছে
        hospitalId: hospital.hospitalId, 
        hospitalName: hospital.hospitalName,
        bookingType,
        appointmentDate,
        patientName,
        patientPhone,
        totalAmount: calculateTotal(),
        selectedDoctor: bookingType === 'doctor' ? {
          id: chosenDoctor._id,
          name: chosenDoctor.doctorName,
          specialty: chosenDoctor.specialty,
          fee: chosenDoctor.visitFee
        } : null,
        selectedTests: bookingType === 'test' ? 
          chosenTests.map(t => ({
            id: t._id,
            name: t.testName,
            code: t.testCode,
            fee: t.testFee
          })) : []
      };

      const response = await axios.post('http://localhost:3000/bookings/create', payload, {
        headers: {
          'Content-Type': 'application/json',
          'email': 'hospital2@gmail.com'
        }
      });

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your appointment request has been submitted successfully!',
          icon: 'success',
          confirmButtonColor: '#4f46e5'
        });

        // ফর্ম রিসেট
        setChosenDoctor(null);
        setChosenTests([]);
        setBookingType(null);
        setPatientName('');
        setPatientPhone('');
        setAppointmentDate('');
      }
    } catch (err) {
      console.error("Booking Error:", err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || "Booking failed. Please try again.",
        icon: 'error'
      });
    } finally {
      setBookingSubmitLoading(false);
    }
  };
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Cover Photo */}
      <div className="h-64 md:h-80 w-full bg-gray-300 relative">
        <img src={hospital?.hospitalCover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-6 left-6">
          <Link to="/hospitals" className="bg-white/90 hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-xl shadow transition-all text-sm">
            ← Back to Networks
          </Link>
        </div>
      </div>

      {/* Profile Overlap */}
      <div className="container mx-auto p-4 max-w-6xl -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
            <img src={hospital?.hospitalLogo} alt="Logo" className="w-28 h-28 rounded-2xl object-cover border-4 border-white bg-white shadow-lg" />
            <div className="flex-1 mt-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{hospital?.hospitalName}</h1>
              <p className="text-gray-500 mt-2">📍 {hospital?.fullAddress || hospital?.address}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-dashed border-gray-100 text-sm">
                <div className="bg-slate-50 px-3 py-2 rounded-xl text-gray-700 font-medium">📞 Phone: {hospital?.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-4 border-b border-gray-200 mb-6 bg-white p-2 rounded-2xl shadow-sm">
              <button onClick={() => setActiveTab('doctors')} className={`flex-1 py-3 text-center font-bold rounded-xl transition-all ${activeTab === 'doctors' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}>
                👨‍⚕️ Doctors ({doctors?.length || 0})
              </button>
              <button onClick={() => setActiveTab('tests')} className={`flex-1 py-3 text-center font-bold rounded-xl transition-all ${activeTab === 'tests' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}>
                🔬 Tests ({tests?.length || 0})
              </button>
            </div>

            {/* Doctors List */}
            {activeTab === 'doctors' && (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                      <img src={doctor.image} alt="Doctor" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-50 bg-slate-50" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{doctor.doctorName}</h3>
                        <p className="text-sm font-bold text-indigo-600">{doctor.specialty} • <span className="text-gray-500 font-normal">{doctor.primaryDegree}</span></p>
                        <p className="text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md inline-block font-medium mt-1">
                          🕒 Available: 04:00 PM - 08:00 PM (Sat-Thu)
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-lg font-black text-emerald-600 mb-2">৳ {doctor.visitFee}</div>
                      <button 
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${chosenDoctor?._id === doctor._id ? 'bg-emerald-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                      >
                        {chosenDoctor?._id === doctor._id ? '✓ Selected' : 'Book Appointment'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tests List */}
            {activeTab === 'tests' && (
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-4 text-center w-12">Select</th>
                        <th className="p-4">Test Name & Info</th>
                        <th className="p-4 text-right pr-6">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-gray-700">
                      {tests.map((test) => (
                        <tr key={test._id} className="hover:bg-slate-50/40">
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              checked={chosenTests.some(t => t._id === test._id)}
                              onChange={() => handleTestCheckboxChange(test)}
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-800">{test.testName}</div>
                            <div className="text-xs text-indigo-600 font-mono mt-0.5">{test.testCode}</div>
                            {test.description && <p className="text-xs text-gray-400 font-normal mt-1">{test.description}</p>}
                          </td>
                          <td className="p-4 text-right pr-6 font-extrabold text-emerald-600">৳ {test.testFee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div id="booking-section" className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-extrabold text-gray-800 border-b border-gray-100 pb-3 mb-4">💳 Checkout Summary</h2>
              
              {!bookingType ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Select a doctor or test to book appointment
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Selected Service</p>
                    {bookingType === 'doctor' && chosenDoctor && (
                      <div className="mt-1 font-bold text-gray-800">Dr. {chosenDoctor.doctorName}</div>
                    )}
                    {bookingType === 'test' && (
                      <div className="mt-1 text-sm text-gray-600">
                        {chosenTests.length} test(s) selected
                      </div>
                    )}
                    <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total:</span>
                      <span className="text-xl font-black text-emerald-600">৳ {calculateTotal()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Patient Full Name</label>
                    <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
                    <input type="tel" required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="Enter mobile number" className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Appointment Date</label>
                    <input type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={bookingSubmitLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {bookingSubmitLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;