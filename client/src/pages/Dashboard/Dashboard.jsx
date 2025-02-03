import React from "react";
import { Outlet } from "react-router-dom";
import RoleSidebar from "../../components/RoleSidebar/RoleSidebar";

function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <RoleSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
