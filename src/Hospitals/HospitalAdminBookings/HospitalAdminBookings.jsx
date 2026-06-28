import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const HospitalAdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Sorting & Filtering States
  const [sortType, setSortType] = useState('all'); // 'all', 'today', 'doctor', 'test'
  const [dateSort, setDateSort] = useState('newest'); // 'newest', 'oldest'

  const fetchBookings = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:3000/hospitals/bookings/${user.email}`
      );

      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err.response?.data || err.message);
      setError("Failed to load bookings. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else {
      setLoading(false);
      setError("Please login as a Hospital Admin.");
    }
  }, [user?.email]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (sortType === 'doctor') {
      result = result.filter(b => b.bookingType === 'doctor');
    } else if (sortType === 'test') {
      result = result.filter(b => b.bookingType === 'test');
    } else if (sortType === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(b => 
        b.appointmentDate && new Date(b.appointmentDate).toISOString().split('T')[0] === today
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [bookings, sortType, dateSort]);

  // 🎯 এপ্রুভ করার সাথে সাথে এডমিন ইমেইল ব্যাকএন্ডে পাঠানো হচ্ছে কিউ ট্র্যাকিং এর জন্য
  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Mark this booking as ${newStatus}?`)) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/hospitals/bookings/status/${id}`,
        { 
          status: newStatus,
          adminEmail: user?.email // কোন এডমিন এপ্রুভ করলো তা ট্র্যাক করার জন্য
        }
      );

      if (response.data.success) {
        Swal.fire({ title: 'Success!', text: `Booking marked as ${newStatus} and Smart Queue generated.`, icon: 'success', timer: 2000, showConfirmButton: false });
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ title: 'Error', text: "Failed to update status & queue.", icon: 'error' });
    }
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading Bookings & Live Queues...</div>;

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        <p>{error}</p>
        <button onClick={fetchBookings} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold">🏥 Hospital Bookings & Smart Queue Management</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Total Bookings: {bookings.length} | Showing: {filteredBookings.length}
          </p>
        </div>

        {/* Sorting & Filter Buttons */}
        <div className="p-5 border-b border-gray-100 bg-white flex flex-wrap gap-3">
          <button onClick={() => setSortType('all')} className={`px-5 py-2 rounded-xl text-sm font-medium transition ${sortType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>All Bookings</button>
          <button onClick={() => setSortType('today')} className={`px-5 py-2 rounded-xl text-sm font-medium transition ${sortType === 'today' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Today's Bookings</button>
          <button onClick={() => setSortType('doctor')} className={`px-5 py-2 rounded-xl text-sm font-medium transition ${sortType === 'doctor' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Doctor Appointments</button>
          <button onClick={() => setSortType('test')} className={`px-5 py-2 rounded-xl text-sm font-medium transition ${sortType === 'test' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Lab Tests</button>

          <div className="ml-auto flex gap-2">
            <button onClick={() => setDateSort('newest')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${dateSort === 'newest' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Newest First</button>
            <button onClick={() => setDateSort('oldest')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${dateSort === 'oldest' ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Oldest First</button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No bookings found for selected filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Live Token</th>
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Appointment Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50">
                    <td className="p-4 pl-6">
                      <div className="font-medium">{booking.patientName}</div>
                      <div className="text-xs text-gray-500">{booking.patientAge} yrs • {booking.patientGender}</div>
                    </td>
                    
                    {/* ⏳ লাইভ টোকেন ডিসপ্লে কলাম */}
                    <td className="p-4">
                      {booking.queueNumber ? (
                        <div className="flex flex-col">
                          <span className="text-md font-black text-indigo-600">#{booking.queueNumber}</span>
                          <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-max mt-0.5">
                            {booking.queueStatus}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not Generated</span>
                      )}
                    </td>

                    <td className="p-4">
                      {booking.bookingType === 'doctor' ? (
                        <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          👨‍⚕️ Dr. {booking.selectedDoctor?.doctorName || 'N/A'}
                        </span>
                      ) : (
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          🔬 {booking.selectedTests?.map(t => t.testName || t.name).join(', ') || 'N/A'}
                        </span>
                      )}
                    </td>

                    <td className="p-4">{new Date(booking.appointmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-4 font-bold text-emerald-600">৳ {booking.totalAmount}</td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => openDetailsModal(booking)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition">View Details</button>
                        {booking.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Approve</button>
                            <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Section */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl">
              <h3 className="text-xl font-bold">Booking & Queue Details</h3>
              <button onClick={closeModal} className="text-white hover:text-gray-200 text-3xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Patient Info */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">👤 Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold">{selectedBooking.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Age & Gender</p>
                    <p className="font-semibold">{selectedBooking.patientAge} years • {selectedBooking.patientGender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedBooking.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Booking Date</p>
                    <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Smart Queue Field View */}
              {selectedBooking.queueNumber && (
                <div>
                  <h4 className="font-bold text-lg mb-3 text-gray-800">🚀 Live Queue Token Data</h4>
                  <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
                    <div>
                      <p className="text-xs text-gray-500">Assigned Token Number</p>
                      <p className="font-black text-xl text-indigo-700">#{selectedBooking.queueNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Queue Status</p>
                      <p className="font-bold capitalize text-amber-700">{selectedBooking.queueStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Est. Wait Time</p>
                      <p className="font-semibold text-gray-700">{selectedBooking.estimatedWaitTime || "Calculating..."}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Approved By</p>
                      <p className="font-semibold text-gray-700 text-xs">{selectedBooking.approvedBy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-800">🩺 Problem / Symptoms</h4>
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-gray-700 leading-relaxed">
                  {selectedBooking.patientProblem || "No additional information provided."}
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">📋 Service Details</h4>
                <div className="bg-white border border-gray-200 p-5 rounded-2xl">
                  <p className="flex justify-between py-2 border-b"><span className="text-gray-600">Booking Type</span><span className="font-semibold capitalize">{selectedBooking.bookingType}</span></p>
                  <p className="flex justify-between py-2 border-b"><span className="text-gray-600">Appointment Date</span><span className="font-semibold">{new Date(selectedBooking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                  <p className="flex justify-between py-2 border-b"><span className="text-gray-600">Total Amount</span><span className="font-bold text-emerald-600">৳ {selectedBooking.totalAmount}</span></p>

                  {selectedBooking.bookingType === 'doctor' && selectedBooking.selectedDoctor && (
                    <p className="flex justify-between py-2">
                      <span className="text-gray-600">Doctor</span>
                      <span className="font-semibold">Dr. {selectedBooking.selectedDoctor.doctorName} ({selectedBooking.selectedDoctor.specialty})</span>
                    </p>
                  )}

                  {selectedBooking.bookingType === 'test' && selectedBooking.selectedTests?.length > 0 && (
                    <div className="pt-3">
                      <p className="text-gray-600 mb-2">Selected Tests:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedBooking.selectedTests.map((test, idx) => (
                          <li key={idx} className="text-gray-700">
                            {test.testName || test.name} <span className="text-emerald-600">(৳ {test.testFee || test.fee})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={closeModal} className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Close</button>
              {selectedBooking.status === 'pending' && (
                <button 
                  onClick={() => { handleStatusUpdate(selectedBooking._id, 'confirmed'); closeModal(); }}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Approve & Generate Token
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAdminBookings;