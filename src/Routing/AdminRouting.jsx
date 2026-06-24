import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Loading from '../Context/Auth/Loading/Loading';
import { Navigate } from 'react-router';

const AdminRouting = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (user && user.role === 'admin') {
    return children;
  }

  return <Navigate to="/login" replace></Navigate>;
};

export default AdminRouting;