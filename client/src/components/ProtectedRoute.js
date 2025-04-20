import React from 'react';
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, adminOnly = false, children }) {
    if(!user) return <Navigate to="/"/>

    if(adminOnly && !user.isAdmin) return <Navigate to="/home" />

    return children;
}
