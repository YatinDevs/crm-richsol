import React from "react";
import { Navigate } from "react-router-dom";
// import useAuthStore from "../../store/useAuthStore";

const AuthRedirect = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AuthRedirect;
