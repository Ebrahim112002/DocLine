import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthContext';
import { UserPlus, Image, Upload, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const AddDoctor = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  // ইমেজ ইউআরএল ট্র্যাক করার জন্য
  const doctorImgUrl = watch('image');

  const IMGBB_API_KEY = "03a6f29dfab24af518c3ddd38f6131ac";

  const specialties = [
    "Cardiology", "Dermatology", "Neurology", "Pediatrics", 
    "Orthopedics", "Gynecology", "General Surgery", "Internal Medicine", "Psychiatry"
  ];
  const degrees = ["MBBS", "MD", "MS", "FCPS", "FRCS", "Diploma"];
  const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // 📸 ImgBB তে ডক্টরের ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImg(true);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgData = await res.json();

      if (imgData.success) {
        setValue('image', imgData.data.url); // react-hook-form এ ইমেজ লিঙ্ক সেট করা
        Swal.fire({
          icon: 'success',
          title: 'Photo Uploaded!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire('Error', 'Image upload failed. Try again.', 'error');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleDayChange = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const onSubmit = async (data) => {
    if (selectedDays.length === 0) {
      Swal.fire('Error!', 'Please select at least one available day.', 'error');
      return;
    }

    setLoading(true);
    const doctorData = {
      ...data,
      availableDays: selectedDays,
      adminEmail: user?.email,
      createdAt: new Date()
    };

    try {
      const response = await fetch('http://localhost:3000/hospitals/doctors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Doctor Added!',
          text: 'The doctor profile has been created successfully.',
          confirmButtonColor: '#2563eb'
        });
        reset();
        setSelectedDays([]);
      } else {
        Swal.fire('Error', result.message || 'Failed to add doctor.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to add doctor. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto pb-12">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" /> Add New Doctor
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Register official physicians, upload photos, and configure timings.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* ==================== 📸 NEW: IMAGE UPLOAD SECTION ==================== */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/70">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-sm">
            {doctorImgUrl ? (
              <img src={doctorImgUrl} alt="Doctor" className="w-full h-full object-cover" />
            ) : (
              <Image className="w-8 h-8 text-gray-300" />
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-gray-800">Doctor's Profile Photo</h4>
            <p className="text-xs text-gray-400 max-w-xs">Upload a formal passport-sized photograph. PNG or JPG preferred.</p>
            
            <label htmlFor="doc-img-input" className="btn btn-sm btn-outline rounded-xl font-bold flex items-center gap-2 w-fit mx-auto sm:mx-0 cursor-pointer mt-1">
              <Upload className="w-3.5 h-3.5" />
              {uploadingImg ? 'Uploading...' : 'Choose Photo'}
            </label>
            <input id="doc-img-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {/* hidden input react-hook-form এর সাথে বাইন্ড করার জন্য */}
            <input type="hidden" {...register('image')} />
          </div>
        </div>

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">DOCTOR NAME *</label>
            <input type="text" placeholder="e.g. Dr. Ayaan Rahman" className="input input-bordered rounded-xl bg-gray-50/50" {...register('doctorName', { required: true })} />
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">DOCTOR EMAIL *</label>
            <input type="email" placeholder="doctor@gmail.com" className="input input-bordered rounded-xl bg-gray-50/50" {...register('doctorEmail', { required: true })} />
          </div>
        </div>

        {/* SECTION 2: SPECIALTY, DEGREE & LICENSE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">SPECIALTY *</label>
            <select className="select select-bordered rounded-xl bg-white" {...register('specialty', { required: true })}>
              {specialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">PRIMARY DEGREE *</label>
            <select className="select select-bordered rounded-xl bg-gray-50/50" {...register('primaryDegree', { required: true })}>
              {degrees.map((deg, i) => <option key={i} value={deg}>{deg}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">BMDC REG NO *</label>
            <input type="text" placeholder="e.g. A-XXXXX" className="input input-bordered rounded-xl bg-gray-50/50" {...register('bmdcNumber', { required: true })} />
          </div>
        </div>

        {/* SECTION 3: TIMING & VISIT FEE */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">EXPERIENCE (YEARS)</label>
            <input type="number" placeholder="5" className="input input-bordered rounded-xl bg-gray-50/50" {...register('experienceYears')} />
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">VISIT FEE (BDT) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="number" placeholder="600" className="input input-bordered w-full pl-9 rounded-xl bg-gray-50/50" {...register('visitFee', { required: true })} />
            </div>
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">START TIME *</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="time" className="input input-bordered w-full pl-9 rounded-xl bg-gray-50/50" {...register('startTime', { required: true })} />
            </div>
          </div>
          <div className="form-control">
            <label className="label font-bold text-gray-700 text-xs mb-1">END TIME *</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="time" className="input input-bordered w-full pl-9 rounded-xl bg-gray-50/50" {...register('endTime', { required: true })} />
            </div>
          </div>
        </div>

        {/* SECTION 4: ROSTER SCHEDULE */}
        <div className="form-control">
          <label className="label font-bold text-gray-700 text-xs mb-1">AVAILABLE DAYS *</label>
          <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {weekDays.map((day, idx) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleDayChange(day)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: BIOGRAPHY */}
        <div className="form-control">
          <label className="label font-bold text-gray-700 text-xs mb-1">BIOGRAPHY / REMARKS</label>
          <textarea rows="3" placeholder="Enter academic or background remarks..." className="textarea textarea-bordered rounded-xl bg-gray-50/50 focus:bg-white" {...register('biography')}></textarea>
        </div>

        <div className="pt-4 border-t border-gray-50 flex justify-end">
          <button type="submit" disabled={loading || uploadingImg} className="btn btn-primary rounded-xl font-bold flex items-center gap-2 px-6 shadow-md shadow-blue-100">
            {loading ? 'Registering...' : <><UserPlus className="w-4 h-4" /> Save Doctor Profile</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddDoctor;