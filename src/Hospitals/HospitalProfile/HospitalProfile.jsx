import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthContext';
import { AlertCircle, Save, Upload, Building2, Phone, MapPin, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const HospitalProfile = () => {
  const { user } = useContext(AuthContext);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const logoUrl = watch('hospitalLogo');
  const coverUrl = watch('hospitalCover');

  const IMGBB_API_KEY = "03a6f29dfab24af518c3ddd38f6131ac";

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/hospitals/profile/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data && data._id) {
            Object.keys(data).forEach(key => setValue(key, data[key]));
            setIsProfileComplete(data.isProfileComplete ?? true);
          } else {
            setIsProfileComplete(false);
          }
          setLoading(false);
        })
        .catch(() => {
          setIsProfileComplete(false);
          setLoading(false);
        });
    }
  }, [user, setValue]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (type === 'logo') setUploadingLogo(true);
    if (type === 'cover') setUploadingCover(true);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgData = await res.json();

      if (imgData.success) {
        if (type === 'logo') setValue('hospitalLogo', imgData.data.url);
        if (type === 'cover') setValue('hospitalCover', imgData.data.url);
        
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: `${type === 'logo' ? 'Logo' : 'Cover image'} uploaded successfully.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploadingLogo(false);
      setUploadingCover(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.hospitalLogo || !data.hospitalCover) {
      Swal.fire('Error!', 'Please upload both Hospital Logo and Cover Image.', 'error');
      return;
    }

    try {
      const updatedProfile = {
        ...data,
        email: user?.email,
        isProfileComplete: true
      };

      const response = await fetch('http://localhost:3000/hospitals/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      const result = await response.json();

      if (result.success) {
        setIsProfileComplete(true);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your hospital profile has been successfully saved.',
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update profile. Try again.', 'error');
    }
  };

  if (loading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {!isProfileComplete && (
        <div className="alert alert-warning shadow-sm border border-amber-200 bg-amber-50 text-amber-900 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm sm:text-base">Complete Your Hospital Profile!</h3>
            <p className="text-xs sm:text-sm text-amber-700">Please fill up all required corporate information and upload branding images to go live.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* ==================== SECTION 1: BRANDING (IMAGES) ==================== */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          {/* Cover Image Box */}
          <div className="h-48 sm:h-64 bg-gray-100 relative flex items-center justify-center group">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-1 opacity-40" />
                <span className="text-xs font-semibold">No Cover Image Uploaded</span>
              </div>
            )}
            
            {/* ফিক্সড: htmlFor এবং id বাইন্ডিং করার ফলে ব্যাক কাভারে ক্লিক ১০০% কাজ করবে */}
            <label 
              htmlFor="cover-input" 
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all backdrop-blur-sm shadow-sm z-10"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploadingCover ? 'Uploading...' : 'Upload Cover Image *'}
            </label>
            <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
          </div>

          {/* Logo & Basic Header Row */}
          <div className="px-6 sm:px-8 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-4 border-white shadow-md rounded-2xl overflow-hidden relative group flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-300" />
              )}
              <label 
                htmlFor="logo-input" 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-opacity text-center p-2"
              >
                {uploadingLogo ? '...' : 'Upload Logo *'}
              </label>
              <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
            </div>
            
            <div className="text-center sm:text-left sm:mb-2 flex-1">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Hospital Identity & Setup
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage institutional records, locations, and facilities.</p>
            </div>
          </div>
        </div>

        {/* ==================== SECTION 2: BASIC INFO & CONTACT ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-3">
              <Building2 className="w-4 h-4 text-blue-600" /> Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">HOSPITAL NAME *</label>
                <input type="text" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('hospitalName', { required: true })} />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">HOSPITAL TYPE *</label>
                <select className="select select-bordered rounded-xl bg-white focus:bg-white transition-colors" {...register('hospitalType', { required: true })}>
                  <option value="General">General Hospital</option>
                  <option value="Specialized">Specialized Hospital</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Diagnostic Center">Diagnostic Center</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">LICENSE NUMBER *</label>
                <input type="text" placeholder="HE-XXXXX" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('licenseNumber', { required: true })} />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">ESTABLISHED YEAR</label>
                <input type="number" placeholder="e.g. 2015" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('establishedYear')} />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-gray-700 text-xs mb-1">SHORT DESCRIPTION</label>
              <textarea rows="3" placeholder="Write a short summary about your healthcare standards..." className="textarea textarea-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('shortDescription')}></textarea>
            </div>

            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pt-4 pb-3">
              <Phone className="w-4 h-4 text-blue-600" /> Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">HOSPITAL PHONE *</label>
                <input type="text" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('phone', { required: true })} />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">EMERGENCY HOTLINE (24/7) *</label>
                <input type="text" placeholder="e.g. 10666" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('emergencyPhone', { required: true })} />
              </div>
            </div>
          </div>

          {/* ==================== SECTION 3: LOCATION & FACILITIES ==================== */}
          <div className="space-y-6">
            
            {/* Location Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Location
              </h3>
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">AREA / DISTRICT *</label>
                <input type="text" placeholder="e.g. Dhanmondi, Dhaka" className="input input-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('district', { required: true })} />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-700 text-xs mb-1">FULL ADDRESS *</label>
                <textarea rows="3" placeholder="House, Road, Block info..." className="textarea textarea-bordered rounded-xl bg-gray-50/50 focus:bg-white transition-colors" {...register('fullAddress', { required: true })}></textarea>
              </div>
            </div>

            {/* ফিক্সড: স্পেসিং ও লেগে থাকার সমস্যা দূর করতে space-y-3 এবং padding মডিফাই করা হয়েছে */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Critical Facilities
              </h3>
              
              <div className="space-y-3 pt-1">
                <label className="label cursor-pointer justify-start gap-4 bg-gray-50/70 hover:bg-gray-100/50 px-4 py-3 rounded-xl transition-colors border border-gray-100/50">
                  <input type="checkbox" className="checkbox checkbox-primary rounded-md checkbox-sm" {...register('hasEmergency247')} />
                  <span className="label-text font-bold text-gray-700">24/7 Emergency Room</span>
                </label>
                
                <label className="label cursor-pointer justify-start gap-4 bg-gray-50/70 hover:bg-gray-100/50 px-4 py-3 rounded-xl transition-colors border border-gray-100/50">
                  <input type="checkbox" className="checkbox checkbox-primary rounded-md checkbox-sm" {...register('hasAmbulance')} />
                  <span className="label-text font-bold text-gray-700">Own Ambulance Service</span>
                </label>
                
                <label className="label cursor-pointer justify-start gap-4 bg-gray-50/70 hover:bg-gray-100/50 px-4 py-3 rounded-xl transition-colors border border-gray-100/50">
                  <input type="checkbox" className="checkbox checkbox-primary rounded-md checkbox-sm" {...register('hasICU')} />
                  <span className="label-text font-bold text-gray-700">ICU Available</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-end shadow-sm">
          <button type="submit" className="btn btn-primary rounded-xl font-bold flex items-center gap-2 px-6 shadow-md shadow-blue-100">
            <Save className="w-4 h-4" /> Save Professional Profile
          </button>
        </div>

      </form>
    </div>
  );
};

export default HospitalProfile;