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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              // <AuthRedirect>
              <AuthPage />
              // </AuthRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              // <AuthRedirect>
              <SignupPage />
              // </AuthRedirect>
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
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
