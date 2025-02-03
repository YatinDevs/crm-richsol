import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const sidebars = {
  admin: [
    { label: "Manage Employees", link: "employees" },
    { label: "Manage Clients", link: "clients" },
    { label: "Manage Tasks", link: "tasks" },
  ],
  hr: [
    { label: "Manage Employees", link: "employees" },
    { label: "Manage Clients", link: "clients" },
    { label: "Manage Tasks", link: "tasks" },
    // { label: "Employee Records", link: "employees" },
    // { label: "Attendance", link: "attendance" },
    // { label: "Leave Requests", link: "leave" },
  ],
  //   accounts: [
  //     { label: "Invoices", link: "invoices" },
  //     { label: "Payroll", link: "payroll" },
  //     { label: "Expenses", link: "expenses" },
  //   ],
  //   support: [
  //     { label: "Tickets", link: "tickets" },
  //     { label: "Client Issues", link: "issues" },
  //     { label: "Knowledge Base", link: "knowledge" },
  //   ],
  //   sales: [
  //     { label: "Leads", link: "leads" },
  //     { label: "Deals", link: "deals" },
  //     { label: "Reports", link: "reports" },
  //   ],
};

function RoleSidebar() {
  const { employee } = useAuthStore();
  const role = employee?.role;
  const menu = sidebars[role] || [];

  return (
    <div className="hidden md:block w-64 min-h-screen bg-gray-800 text-white p-4">
      <ul className="space-y-4">
        {menu.map((item) => (
          <li key={item.link} className="p-2 rounded">
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `block text-sm md:text-lg p-2 rounded ${
                  isActive ? "bg-gray-600" : "hover:bg-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoleSidebar;
