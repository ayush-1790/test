"use client";

import React, { useEffect, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";
import { AiOutlineLogout } from "react-icons/ai";
import { LogoutIcon } from "./CustomIcons";
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isAuthenticated } = useUserContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  const getUserName = () => {
    if (!user?.email) return "User";
    return user.email
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/(^\w|\s\w)/g, (c) => c.toUpperCase());
  };
  const getUserInitials = () => {
    const name = getUserName();
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  const userInitials = user?.email ? getUserInitials() : "?";

  return (
    <nav className="bg-text-main shadow-b shadow-xl px-3 relative">
      <div className="flex items-center justify-between">
        {/* details left */}
        <div className="py-4 px-3">
          <p className="text-sm font-medium text-white mb-1">{getUserName()}</p>

          {user?.role && (
            <p className="text-xs text-border-line font-medium">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          )}
        </div>

        {/* buttons right  */}
        <div className="py-4 px-3 flex space-x-4">
          {/* Settings Dropdown */}
          <div ref={dropdownRef} className="relative w-9 h-9">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-full cursor-pointer bg-[#002a3b] rounded-[20%] border border-[#03445e] text-white hover:text-white-700 flex items-center justify-center text-sm font-semibold"
            >
              {userInitials}
            </button>

            <div
              className={`absolute right-0 mt-2 w-80 bg-white border border-border rounded-lg shadow-lg text-black z-50 p-4 transform transition-transform duration-800 ease-in-out
      ${dropdownOpen ? "translate-x-0" : "translate-x-100 pointer-events-none"}
    `}
            >
              <div className="flex items-center justify-between border-b-2 pb-5 border-gray-100 mb-4">
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-13 h-13 bg-primary/40 text-text flex items-center justify-center rounded-full text-lg font-medium">
                    {userInitials}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-text">
                      {getUserName()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.email || "No Email"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0 cursor-pointer"
                  aria-label="back"
                >
                  <RxCross2 size={20} />
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition mt-3 px-2 py-1"
              >
                <LogoutIcon
                  size={20}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                />
                <h2 className="text-lg font-medium">Logout</h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
