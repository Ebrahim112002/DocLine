import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';


const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const { user } = useContext(AuthContext);   // ← AuthContext থেকে ইউজার নেওয়া

  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      if (!user?.email) {
        setError("Please login to see your appointments");
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:3000/bookings/my-bookings', {
        headers: { 
          email: user.email 
        }
      });

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load your appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    } else {
      setLoading(false);
      setError("Please login to view appointments");
    }
  }, [user]);

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setCancelingId(bookingId);
      
      await axios.patch(`http://localhost:3000/bookings/cancel/${bookingId}`, {}, {
        headers: { 
          email: user.email 
        }
      });

      Swal.fire({
        title: 'Cancelled!',
        text: 'Appointment cancelled successfully.',
        icon: 'success'
      });

      fetchMyBookings(); // Refresh
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to cancel',
        icon: 'error'
      });
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading your appointments...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!user) return <div className="text-center py-10">Please login to see your bookings.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <button 
          onClick={fetchMyBookings}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xl">
          You have no appointments yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800">{booking.hospitalName}</h2>
                  <p className="text-gray-600 mt-1">
                    {booking.bookingType === 'doctor' ? 'Doctor Appointment' : 'Medical Test Package'}
                  </p>
                </div>

                <span className={`px-5 py-2.5 rounded-2xl text-sm font-semibold self-start ${getStatusColor(booking.status)}`}>
                  {booking.status?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-lg">
                    {new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {booking.selectedDoctor && (
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{booking.selectedDoctor.doctorName}</p>
                    <p className="text-sm text-gray-600">{booking.selectedDoctor.specialty}</p>
                  </div>
                )}

                {booking.selectedTests?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Tests</p>
                    <p className="font-medium">
                      {booking.selectedTests.map(t => t.testName || t.name || t).join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">৳{booking.totalAmount}</p>
                </div>

                {booking.status?.toLowerCase() === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={cancelingId === booking._id}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition disabled:bg-gray-400"
                  >
                    {cancelingId === booking._id ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;