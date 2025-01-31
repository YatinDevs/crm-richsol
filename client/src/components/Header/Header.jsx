import React from "react";
import Logo from "./Logo/Logo";

function Header() {
  return (
    <header className="w-full max-w-[1440px]  mx-auto sticky min-h-[6dvh] rounded-b-3xl h-14 top-0 shadow-2xl z-10">
      <div className="w-full max-w-[1440px] mx-auto h-full flex items-center rounded-b-3xl bg-white  px-[10px] justify-between max-sm:px-1">
        <div className="flex items-center h-full justify-center ">
          <Logo />
        </div>
        <div className="flex  items-center justify-center mr-5 gap-2">
          <div> </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
