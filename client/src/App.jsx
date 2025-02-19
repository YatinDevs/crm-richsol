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
import ManageEmployee from "./pages/Admin/ManageEmployee";
import ManageClients from "./pages/Admin/ManageClients";
import ManageTasks from "./pages/Admin/ManageTasks";
import AddEmployee from "./pages/ManageEmp/AddEmployee";
import EmployeeList from "./pages/ManageEmp/EmployeeList";
import ManageAttendance from "./pages/ManageEmp/ManageAttendance";
import ManageLeaveRequest from "./pages/ManageEmp/ManageLeaveRequest";
import ClientForm from "./pages/ManageClient/ClientForm";
import useAuthStore from "./store/authStore";
import InvoiceGenerator from "./pages/ManageAccounts/InvoiceGenerator";
import EmployeeEditForm from "./pages/ManageEmp/EmployeeEditForm";
import ManageServices from "./pages/ManageServices/ManageServices";
import AddServiceForm from "./pages/ManageServices/AddService";
import MultiStepInvoiceForm from "./pages/ManageAccounts/MultiStepInvoiceForm";
import InvoiceDownload from "./pages/ManageAccounts/InvoiceDownload";

function App() {
  const { checkAuth, employee, isAuthenticated } = useAuthStore();
  console.log(employee);
  console.log(isAuthenticated);
  useEffect(() => {
    checkAuth();
  }, []);

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
            path="/dashboard/employees/edit/:id"
            element={<EmployeeEditForm />}
          />
          <Route
            path="/dashboard/employees/attend"
            element={<ManageAttendance />}
          />
          <Route
            path="/dashboard/employees/leave"
            element={<ManageLeaveRequest />}
          />{" "}
          {/* Admin Routes */}
          <Route path="/dashboard/clients" element={<ManageClients />} />
          <Route path="/dashboard/clients/add" element={<ClientForm />} />
          <Route path="/dashboard/tasks" element={<ManageTasks />} />
          <Route
            path="/dashboard/accounts/invoice"
            element={<MultiStepInvoiceForm />}
          />{" "}
          <Route path="/dashboard/accounts/get" element={<InvoiceDownload />} />{" "}
          {/* Admin Routes */}
          <Route path="/dashboard/services" element={<ManageServices />} />
          <Route path="/dashboard/services/add" element={<AddServiceForm />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
