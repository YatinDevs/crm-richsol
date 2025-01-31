import React from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/Header/Header";

function Layout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Pages where the header should be hidden
  const isHomePageLogin =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!isHomePageLogin && <Header />}

      <Outlet />
    </>
  );
}

export default Layout;
