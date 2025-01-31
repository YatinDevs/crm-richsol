import React from "react";
import { logout } from "../../services/auth";
import useAuthStore from "../../store/auth";

const Logout = () => {
  const { logout: storeLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      storeLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
