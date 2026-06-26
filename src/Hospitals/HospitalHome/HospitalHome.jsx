import React from 'react';
import { Stethoscope, Calendar, Users, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

const HospitalHome = () => {
  // ডেমো স্ট্যাটিস্টিকস ডাটা
  const stats = [
    { title: 'Total Doctors', value: '42', description: 'Active practitioners', icon: Stethoscope, color: 'bg-blue-50 text-blue-600' },
    { title: "Today's Appointments", value: '128', description: '+12% from yesterday', icon: Calendar, color: 'bg-green-50 text-green-600' },
    { title: 'Total Assistants', value: '18', description: 'Assigned to chambers', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { title: 'Live Queue Status', value: '14', description: 'Patients waiting now', icon: Activity, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900">স্বাগতম, হসপিটাল এডমিন Panel! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">আজকের হসপিটাল শিডিউল, ডক্টর চেম্বার এবং অ্যাপয়েন্টমেন্ট এক নজরে পর্যবেক্ষণ করুন।</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold self-start sm:self-center">
          <TrendingUp className="w-4 h-4" /> System Online
        </div>
      </div>

      {/* Grid Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-400 block">{stat.title}</span>
                <span className="text-3xl font-black text-gray-900 block">{stat.value}</span>
                <span className="text-xs text-gray-500 block">{stat.description}</span>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Container Blocks (Live Monitoring & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments Table Section */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
            <h3 className="font-bold text-gray-900 text-lg">সদ্য আসা অ্যাপয়েন্টমেন্ট (Recent Appointments)</h3>
            <button className="btn btn-ghost btn-xs text-blue-600 font-bold flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-none">
                  <th>Patient</th>
                  <th>Assigned Doctor</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="font-medium text-gray-600">
                <tr className="border-b border-gray-50">
                  <td className="font-bold text-gray-900">Ayaan Rahman</td>
                  <td>Dr. Hasan (Cardiology)</td>
                  <td className="font-mono text-xs">10:30 AM</td>
                  <td><span className="badge badge-sm badge-success font-bold text-white px-2.5 py-2">Confirmed</span></td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="font-bold text-gray-900">Anika Chowdhury</td>
                  <td>Dr. Sabrina (Pediatrics)</td>
                  <td className="font-mono text-xs">11:15 AM</td>
                  <td><span className="badge badge-sm badge-warning font-bold text-white px-2.5 py-2">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Department Overview */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg border-b border-gray-50 pb-4 mb-4">কুইক অ্যাকশন প্যানেল</h3>
            <div className="space-y-3">
              <button className="btn btn-outline btn-primary w-full rounded-xl justify-start font-bold text-sm">+ নতুন ডক্টর যুক্ত করুন</button>
              <button className="btn btn-outline btn-secondary w-full rounded-xl justify-start font-bold text-sm">+ নতুন অ্যাসিস্ট্যান্ট সেট করুন</button>
              <button className="btn btn-outline w-full rounded-xl justify-start font-bold text-sm">ডিপার্টমেন্ট সেটিংস আপডেট</button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-dashed border-gray-100 text-center text-xs text-gray-400 font-medium">
            DocLine Security Protocol Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHome;