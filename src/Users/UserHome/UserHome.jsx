import React from 'react';

const UserHome = () => {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Welcome back, Rahim 👋</h1>
          <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your health today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="text-emerald-600 text-4xl mb-3">📅</div>
            <h3 className="text-3xl font-bold text-gray-800">3</h3>
            <p className="text-gray-600">Upcoming Appointments</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="text-blue-600 text-4xl mb-3">🧪</div>
            <h3 className="text-3xl font-bold text-gray-800">7</h3>
            <p className="text-gray-600">Tests Completed</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="text-amber-600 text-4xl mb-3">⭐</div>
            <h3 className="text-3xl font-bold text-gray-800">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🩺</div>
              <div className="flex-1">
                <p className="font-medium">Appointment with Dr. Fatema Khan</p>
                <p className="text-sm text-gray-500">Tomorrow at 5:30 PM • General Medicine</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Confirmed</span>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
              <div className="flex-1">
                <p className="font-medium">Blood Test Report Ready</p>
                <p className="text-sm text-gray-500">Completed on 25 June 2026</p>
              </div>
              <button className="text-indigo-600 text-sm font-medium hover:underline">View Report →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;