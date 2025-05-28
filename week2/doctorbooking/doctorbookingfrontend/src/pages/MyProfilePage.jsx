import React from 'react';
import { useAuth } from '../context/auth/AuthContext';
import MyProfilePatient from './MyProfilePatient';
import MyProfileDoctor from './MyProfileDoctor';
import { Navigate } from 'react-router-dom';

const MyProfilePage = () => {
    const { isAuthenticated, userId, userRole } = useAuth();

    if (!isAuthenticated) {
        // Optionally, redirect to login or show a message
        return <Navigate to="/login" replace />;
    }

    if (!userId || !userRole) {
        // Data still loading or missing, show loading or error
        // Or redirect if this state is unexpected after being authenticated
        return <div>Loading profile information...</div>; 
    }

    if (userRole === 'patient') {
        return <MyProfilePatient patientId={userId} />;
    } else if (userRole === 'doctor') {
        return <MyProfileDoctor doctorId={userId} />;
    } else {
        // Handle unknown role or error
        return <div>Error: Unknown user role.</div>;
    }
};

export default MyProfilePage; 