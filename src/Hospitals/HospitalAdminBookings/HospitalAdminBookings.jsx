import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HospitalAdminBookings = ({ adminEmail = "hospital2@gmail.com" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Fetching bookings for: ${adminEmail}`);

      const response = await axios.get(
        `http://localhost:3000/hospitals/bookings/${adminEmail}`
      );

      console.log("✅ Raw Response:", response.data);

      const data = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total Bookings Received: ${data.length}`);

      setBookings(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err.response?.data || err.message);
      setError("Failed to load bookings. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [adminEmail]);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Mark as ${newStatus}?`)) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/hospitals/bookings/status/${id}`,
        { status: newStatus }
      );

      if (response.data.success) {
        alert(`Booking ${newStatus} successfully!`);
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading Bookings...</div>;

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
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold">🏥 Hospital Bookings</h2>
          <p className="text-indigo-100 text-sm mt-1">Total: {bookings.length} bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No bookings found for this hospital yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-sm">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50">
                    <td className="p-4 pl-6">
                      <div className="font-medium">{booking.patientName}</div>
                      <div className="text-xs text-gray-500">{booking.patientPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.bookingType === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {booking.bookingType}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.bookingType === 'doctor' 
                        ? `Dr. ${booking.selectedDoctor?.name || 'N/A'}`
                        : booking.selectedTests?.map(t => t.name).join(', ') || 'N/A'}
                    </td>
                    <td className="p-4">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
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
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                          <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalAdminBookings;