import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // 🎯 সঠিকভাবে এক্সিওস ইমপোর্ট করা হয়েছে

const HospitalDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');

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
      <div className="text-center my-16 p-6 text-red-500 font-semibold">
        {error || 'No data found.'}
      </div>
    );
  }

  const { hospital, doctors, tests } = data;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Giant Cover Photo Banner */}
      <div className="h-64 md:h-80 w-full bg-gray-300 relative">
        <img 
          src={hospital?.hospitalCover} 
          alt={`${hospital?.hospitalName} Cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        
        {/* Back Button Overlay */}
        <div className="absolute top-6 left-6">
          <Link to="/hospitals" className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-xl shadow transition-all text-sm">
            ← Back to Networks
          </Link>
        </div>
      </div>

      {/* Main Container Overlap Profile */}
      <div className="container mx-auto p-4 max-w-6xl -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
            <img 
              src={hospital?.hospitalLogo} 
              alt={`${hospital?.hospitalName} Logo`} 
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white bg-white shadow-lg"
            />
            <div className="flex-1 mt-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {hospital?.hospitalType || "General Hospital"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">{hospital?.hospitalName}</h1>
              <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-1">
                <span>📍</span> {hospital?.fullAddress || hospital?.address}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-dashed border-gray-100 text-sm text-gray-700 font-medium">
                <div className="bg-slate-50 px-3 py-2 rounded-xl">📞 Phone: {hospital?.phone}</div>
                {hospital?.emergencyPhone && (
                  <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl">🚨 Emergency: {hospital?.emergencyPhone}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Selector */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 bg-white p-2 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-3.5 text-center font-bold text-base md:text-lg rounded-xl transition-all ${
              activeTab === 'doctors' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            👨‍⚕️ Expert Doctors ({doctors?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-3.5 text-center font-bold text-base md:text-lg rounded-xl transition-all ${
              activeTab === 'tests' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
          >
            🔬 Diagnostic Tests ({tests?.length || 0})
          </button>
        </div>

        {/* Tab Display Area */}
        <div>
          {activeTab === 'doctors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!doctors || doctors.length === 0 ? (
                <p className="text-gray-400 text-center py-10 col-span-full bg-white rounded-3xl border border-dashed border-gray-200">এই মুহূর্তে কোনো সক্রিয় ডাক্তার তালিকাভুক্ত নেই।</p>
              ) : (
                doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src={doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop"} 
                      alt="Doctor" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-50 bg-slate-50"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{doctor.doctorName}</h3>
                      <p className="text-sm font-bold text-indigo-600 mb-0.5">{doctor.specialty}</p>
                      <p className="text-xs text-gray-400 font-medium mb-2">{doctor.primaryDegree}</p>
                      <div className="text-sm font-bold text-emerald-600 bg-emerald-50 py-1 px-3 rounded-lg inline-block">
                        Fee: ৳ {doctor.visitFee}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              {!tests || tests.length === 0 ? (
                <p className="text-gray-400 text-center py-10 bg-white border border-dashed border-gray-200 m-4 rounded-2xl">এই মুহূর্তে কোনো মেডিকেল টেস্ট উপলভ্য নেই।</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-4 pl-6">Code</th>
                        <th className="p-4">Test Description</th>
                        <th className="p-4 text-right pr-6">Consultation Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-gray-700">
                      {tests.map((test) => (
                        <tr key={test._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 pl-6 font-mono text-sm text-indigo-600 font-bold">{test.testCode}</td>
                          <td className="p-4 font-semibold text-gray-800">{test.testName}</td>
                          <td className="p-4 text-right pr-6 font-extrabold text-emerald-600">৳ {test.testFee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;