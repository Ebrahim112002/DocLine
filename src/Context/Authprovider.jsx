import React, { createContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth"; // আপনার ফায়ারবেস কনফিগ ফাইলের পাথ দিন
import { AuthContext } from './AuthContext';
import { auth } from '../Firebase/firebase.config';



const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 // ১. ইউজার রেজিস্ট্রেশন (Register)
const createUser = async (email, password, name, photoURL) => {
  setLoading(true);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // ফায়ারবেস প্রোফাইল আপডেট (Name & Photo)
    await updateProfile(result.user, {
      displayName: name,
      photoURL: photoURL
    });
    return result; // সরাসরি রেজাল্ট রিটার্ন করে দিন
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
          // ব্যাকএন্ড থেকে ইউজারের রোল সহ সম্পূর্ণ ডেটা নিয়ে আসা
          const response = await fetch(`http://localhost:3000/users/${currentUser.email}`);
          const backendData = await response.json();
          
          // Firebase ইউজার ডেটার সাথে ব্যাকএন্ডের রোল কম্বাইন করে স্টেট সেট করা
          setUser({ ...currentUser, role: backendData.role });
        } catch (error) {
          console.error("Backend user fetch error:", error);
          setUser(currentUser); // ব্যাকএন্ড ফেইল করলেও ফায়ারবেস ইউজার সেট থাকবে
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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