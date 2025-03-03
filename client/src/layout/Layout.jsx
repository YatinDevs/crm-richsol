import React from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/Header/Header";
import RoleSidebar from "../components/RoleSidebar/RoleSidebar";
import ContentWrapper from "../components/ContentWrapper/ContentWrapper";

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
      <div className={`w-full max-w-[2400px]  mx-auto my-0  py-0 `}>
        <div className="flex h-[100vh]  ">
          <div>
            {/* Sidebar */}
            {!isHomePageLogin && <RoleSidebar />}
          </div>

          {/* Main Content */}
          <div className="flex-1  bg-gray-100 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
