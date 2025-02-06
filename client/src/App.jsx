import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layout/Layout";
import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import AuthPage from "./pages/AuthPages/AuthPage";
import SignupPage from "./pages/AuthPages/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import useAuthStore from "./store/authStore";
import ManageEmployee from "./pages/Admin/ManageEmployee";
import ManageClients from "./pages/Admin/ManageClients";
import ManageTasks from "./pages/Admin/ManageTasks";
import AddEmployee from "./pages/ManageEmp/AddEmployee";
import EmployeeList from "./pages/ManageEmp/EmployeeList";
import ManageAttendance from "./pages/ManageEmp/ManageAttendance";
import ManageLeaveRequest from "./pages/ManageEmp/ManageLeaveRequest";

function App() {
  const { initialize, isAuthenticated } = useAuthStore();
  useEffect(() => {
    initialize(); // Initialize auth state from localStorage or cookies
  }, [initialize]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthRedirect>
                <AuthPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <SignupPage />
              </AuthRedirect>
            }
          />{" "}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route path="/dashboard/employees" element={<ManageEmployee />} />
          <Route path="/dashboard/employees/add" element={<AddEmployee />} />
          <Route path="/dashboard/employees/list" element={<EmployeeList />} />
          <Route
            path="/dashboard/employees/attend"
            element={<ManageAttendance />}
          />
          <Route
            path="/dashboard/employees/leave"
            element={<ManageLeaveRequest />}
          />
          <Route path="/dashboard/clients" element={<ManageClients />} />
          <Route path="/dashboard/tasks" element={<ManageTasks />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
