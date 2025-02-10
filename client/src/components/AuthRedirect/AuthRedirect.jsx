import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;
