import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hospital-public/all');
        if (Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          setHospitals([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError('Hospital data load করতে সমস্যা হচ্ছে। সার্ভার চেক করুন!');
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-500">Loading Docline Networks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-16 p-8 max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl shadow-sm">
        <p className="text-red-500 text-3xl mb-2">⚠️</p>
        <p className="text-gray-800 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white py-16 px-6 text-center shadow-md mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Find Trusted Healthcare Providers
        </h1>
        <p className="text-indigo-100 max-w-2xl mx-auto text-base md:text-lg font-light">
          Docline active medical network-er registered shob top hospitals, expert doctors ebong specialized test pricing dekhun ekhanei.
        </p>
      </div>

      <div className="container mx-auto p-4 max-w-7xl">
        {hospitals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-lg">কোনো সক্রিয় হসপিটাল খুঁজে পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospitals.map((hospital) => (
              <div 
                key={hospital?._id} 
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div>
                  {/* Hospital Cover Image (সরাসরি ব্যাকেন্ডের ফিল্ড থেকে) */}
                  <div className="h-44 w-full bg-gray-200 relative overflow-hidden">
                    <img 
                      src={hospital?.hospitalCover} 
                      alt={`${hospital?.hospitalName} Cover`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      ✓ Verified Facility
                    </span>
                  </div>

                  {/* Hospital Logo (সরাসরি ব্যাকেন্ডের ফিল্ড থেকে) */}
                  <div className="px-6 relative -mt-10 mb-3 flex items-end">
                    <img 
                      src={hospital?.hospitalLogo} 
                      alt={`${hospital?.hospitalName} Logo`} 
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white bg-white shadow-md"
                    />
                  </div>

                  {/* Hospital Info */}
                  <div className="p-6 pt-2">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {hospital?.hospitalName}
                    </h2>
                    
                    <p className="text-gray-500 text-sm flex items-start gap-1.5 mt-2 min-h-[40px]">
                      <span className="text-lg">📍</span>
                      <span className="line-clamp-2">{hospital?.address || hospital?.fullAddress || 'Address not listed'}</span>
                    </p>

                    <p className="text-gray-600 text-sm font-medium flex items-center gap-2 mt-2">
                      <span>📞</span> {hospital?.phone || 'N/A'}
                    </p>

                    {/* Stats Counters */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl mt-5 border border-slate-100">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Doctors</p>
                        <p className="text-2xl font-black text-indigo-600 mt-1">{hospital?.doctorCount || 0}</p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lab Tests</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">{hospital?.testCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="p-6 pt-0">
                  <Link 
                    to={`/hospitals/details/${hospital?._id}`}
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalsPage;