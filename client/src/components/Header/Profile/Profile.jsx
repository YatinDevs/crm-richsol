import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { BsExclamationCircle } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiPackage } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";
import useAuthStore from "../../../store/useAuthStore";

const Profile = () => {
  const navigate = useNavigate();
  const { logOut, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logOut();
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => setOpen(!open)}
        ></Button>
      </div>

      {open && (
        <div className="origin-top-right leading-none absolute text-[13px] right-[-12px] mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 flex justify-between items-center  gap-6 active:scale-95 ">
            <div className="px-5"> {user.name} </div>
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <FaIdCard />
              </Button>
            </div>
          </div>
          <div
            className="py-1 flex justify-between items-center  gap-1 active:scale-95 "
            onClick={() => {
              navigate("/mydetails", { state: { tab: "1" } });
              setOpen(!open);
            }}
          >
            <div className="px-5"> My Trucks </div>
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <LiaShippingFastSolid />
              </Button>
            </div>
          </div>
          <div
            className="py-1 flex justify-between items-center gap-1  active:scale-95 "
            onClick={() => {
              navigate("/mydetails", { state: { tab: "2" } });
              setOpen(!open);
            }}
          >
            {" "}
            <div className="px-5"> My Loads </div>{" "}
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <FiPackage />
              </Button>
            </div>
          </div>

          <div
            className="py-1 flex justify-between items-center gap-2 active:scale-95"
            onClick={() => {
              window.location.href = "https://loadmatch.in";
              setOpen(!open);
            }}
          >
            <div className="px-5"> About Us</div>
            <div className="mr-2">
              <Button shape="circle" className="text-[20px]">
                <BsExclamationCircle />
              </Button>
            </div>
          </div>
          <div
            className="py-1 flex justify-between gap-7 items-center active:scale-95 "
            onClick={handleLogout}
          >
            <div className="px-5"> Logout</div>
            <div className="mr-2">
              <Button shape="circle" icon={<LogoutOutlined />} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
