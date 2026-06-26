import React, { createContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth"; 
import { AuthContext } from './AuthContext';
import { auth } from '../Firebase/firebase.config';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(0); // ডাটাবেজে সেভ হওয়ার পর রোল চেক ট্রিগার করার জন্য

  // ১. ইউজার রেজিস্ট্রেশন (Register)
  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      // ক. ফায়ারবেসে অ্যাকাউন্ট তৈরি
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // খ. ফায়ারবেস প্রোফাইল আপডেট (Name & Photo)
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL
      });

      // গ. ব্যাকএন্ডের মেইন রাউটে ডাটা পাঠানো
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: result.user.uid,
          name: name,
          email: email,
          photoURL: photoURL
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "ব্যাকএন্ডে ইউজার তৈরি করতে ব্যর্থ হয়েছে");
      }

      // ব্যাকএন্ডে ডাটা সেভ সফল হলে স্টেট ট্রিগার করে রোল রি-ফেচ করানো
      setTriggerFetch(prev => prev + 1);
      
      setLoading(false); // 🎯 ফিক্স: সফল হওয়ার পর লোডিং ফলস করা হলো
      return result;

    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ২. ইউজার লগইন (Login)
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. ইউজার লগআউট (Logout)
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ৪. ইউজার স্টেট অবজার্ভার (Observer) + ব্যাকএন্ড রোল ফেচিং
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = localStorage.getItem('access-token');
          
          // ব্যাকএন্ডে রিকোয়েস্ট পাঠানোর সময় হেডার হিসেবে ইমেইল ও টোকেন পাস করা হলো
          const response = await fetch(`http://localhost:3000/users/${currentUser.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': token ? `Bearer ${token}` : '',
              'email': currentUser.email 
            }
          });

          const backendData = await response.json();
          
          if (response.ok && backendData?.role) {
            // ডাটাবেজে থাকা রোল (যেমন: hospital_admin) এবং hospitalId এখানে সেভ হবে
            setUser({ 
              ...currentUser, 
              role: backendData.role,
              hospitalId: backendData?.hospitalId || null 
            });
          } else {
            console.error("Backend error response:", backendData);
            setUser({ ...currentUser, role: 'user' }); 
          }
        } catch (error) {
          console.error("Backend user fetch error:", error);
          setUser({ ...currentUser, role: 'user' }); 
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [triggerFetch]); // triggerFetch চেঞ্জ হলে ইউজার স্টেট আবার আপডেট হবে

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    loginUser,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;