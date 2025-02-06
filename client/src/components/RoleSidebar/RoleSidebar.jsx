import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  Home,
  Users,
  Briefcase,
  ClipboardList,
  FileText,
  Banknote,
  Receipt,
  LifeBuoy,
  AlertCircle,
  BookOpen,
  BarChart,
  TrendingUp,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const sidebars = {
  admin: [
    { label: "Dashboard", link: "dashboard", icon: Home },
    {
      label: "Manage Employees",
      icon: Users,
      subMenu: [
        { label: "Add New Employee", link: "/dashboard/employees/add" },
        { label: "Employee List", link: "/dashboard/employees/list" },
        { label: "Manage Attendance", link: "/dashboard/employees/attend" },
        { label: "Leave Requests", link: "/dashboard/employees/leave" },
      ],
    },
    {
      label: "Manage Clients",
      icon: Briefcase,
      subMenu: [
        { label: "Add New Client", link: "clients/add" },
        { label: "Client List", link: "clients/list" },
      ],
    },
    {
      label: "Manage Tasks",
      icon: ClipboardList,
      subMenu: [
        { label: "Assign Task", link: "tasks/assign" },
        { label: "Task List", link: "tasks/list" },
      ],
    },
    {
      label: "Invoices & Billing",
      icon: FileText,
      subMenu: [
        { label: "Create Invoice", link: "invoices/create" },
        { label: "View Invoices", link: "invoices/list" },
      ],
    },
    {
      label: "Payroll Management",
      icon: Banknote,
      subMenu: [
        { label: "Generate Payroll", link: "payroll/generate" },
        { label: "Payroll History", link: "payroll/history" },
      ],
    },
    {
      label: "Expense Management",
      icon: Receipt,
      subMenu: [
        { label: "Add Expense", link: "expenses/add" },
        { label: "View Expenses", link: "expenses/list" },
      ],
    },
    {
      label: "Support",
      icon: LifeBuoy,
      subMenu: [
        { label: "View Tickets", link: "tickets" },
        { label: "Client Issues", link: "issues" },
        { label: "Knowledge Base", link: "knowledge" },
      ],
    },
    {
      label: "Sales",
      icon: BarChart,
      subMenu: [
        { label: "Leads", link: "leads" },
        { label: "Deals", link: "deals" },
        { label: "Reports", link: "reports" },
      ],
    },
  ],
};
function RoleSidebar() {
  const { employee } = useAuthStore();
  console.log(employee);
  const role = employee?.role;
  const menu = sidebars[role] || [];

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className=" rounded-r-3xl hidden md:flex flex-col w-64 h-screen bg-gray-900 text-white">
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menu.map((item, index) => (
            <li key={index} className="p-2 rounded">
              {item.subMenu ? (
                <div>
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleMenu(index)}
                    className="flex items-center justify-between w-full p-2 rounded text-sm md:text-md hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {openMenus[index] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {openMenus[index] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.link}
                            className={({ isActive }) =>
                              `block p-2 text-sm rounded ${
                                isActive ? "bg-gray-700" : "hover:bg-gray-800"
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded text-sm md:text-md ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-800"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RoleSidebar;
