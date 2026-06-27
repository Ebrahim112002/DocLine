import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const IMGBB_API_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${user.email}`, {
        headers: { email: user.email }
      });
      setProfile(res.data);
      reset(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await axios.post(IMGBB_API_URL, formData);
      return res.data.data.display_url;
    } catch (err) {
      Swal.fire('Error', 'Image upload failed', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    let photoURL = profile?.photoURL;

    if (data.image?.[0]) {
      const newUrl = await uploadImage(data.image[0]);
      if (newUrl) photoURL = newUrl;
    }

    const updatePayload = {
      name: data.name,
      photoURL,
      phone: data.phone || "",
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth || null,
    };

    try {
      const res = await axios.put('http://localhost:3000/users/profile', updatePayload, {
        headers: { email: user.email }
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading your profile...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-2">Manage your personal information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            {isEditing ? 'Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center -mt-16 mb-8">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
            <img
              src={profile?.photoURL || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-3xl font-semibold">{profile?.name}</h2>
          <p className="text-gray-500">{profile?.email}</p>
        </div>

        {/* Info Cards */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="text-xl font-medium">{profile?.phone || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="text-xl font-medium capitalize">{profile?.gender || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="text-xl font-medium">
                {profile?.dateOfBirth 
                  ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB') 
                  : 'Not provided'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-1">Account Status</p>
              <p className="text-xl font-medium flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${profile?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {profile?.status?.toUpperCase()}
              </p>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                  {...register('name', { required: "Name is required" })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="input input-bordered w-full rounded-xl"
                  {...register('phone')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select className="select select-bordered w-full rounded-xl" {...register('gender')}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="input input-bordered w-full rounded-xl"
                  {...register('dateOfBirth')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-xl"
                {...register('image')}
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary w-full text-lg py-3 rounded-2xl"
            >
              {uploading ? 'Uploading Image...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;