"use client";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { sidebarItems } from "../lib/rbac/sidebarConfig";
import SidebarMenuItem from "./SidebarMenuItem";
import { useMemo } from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { can } = useUserContext();

  const filteredItems = useMemo(() => {
    const filter = (items) => {
      return items.reduce((acc, item) => {
        if (item.permission && !can(item.permission)) {
          return acc;
        }

        if (item.children) {
          const filteredChildren = filter(item.children);
          if (filteredChildren.length > 0) {
            acc.push({ ...item, children: filteredChildren });
          }
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
    };

    return filter(sidebarItems);
  }, [can]);

  return (
    <div className="relative">
      <div
        className={`h-full bg-text-main text-gray-700 hover:text-gray-900 transition-all duration-300 overflow-y-auto relative flex flex-col backdrop-blur overflow-hidden ${
          isOpen ? "w-55" : "w-22"
        }`}
        style={{
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.13)",
        }}
      >
        {/* Logo section */}
        <div className="mt-3 mb-4">
          <Link
            href="/"
            className={`flex h-12 w-full  ${
              !isOpen ? "px-2 justify-center" : "justify-center"
            } `}
          >
            {isOpen ? (
              <img
                src="/Adaan-logo-white.png"
                alt="logo"
                className="w-32 px-3 py-2 object-contain"
              />
            ) : (
              <img
                src="/Adaan-logo-white-col.png"
                alt="logo"
                className="w-6 object-contain"
              />
            )}
          </Link>
        </div>

        {/* Content */}
        <div
          className={`${
            isOpen ? "w-[200px]" : "w-16"
          } bg-[#002a3b] rounded-2xl p-2 border border-[#03445e] m-2.5 transition-all duration-300 flex flex-col items-center overflow-hidden`}
        >
          {/* Toggle Button */}
          <div
            className={`w-full mb-4 transition-all items-center duration-300 ease-in-out flex ${
              isOpen
                ? "flex-row items-center justify-between"
                : "flex-col items-center justify-center"
            }`}
          >
            {/* Menu Title */}
            <h2
              className={`text-subtext-muted text-md font- ml-2 ease-in-out ${
                isOpen
                  ? "opacity-100 scale-100 h-auto mb-0"
                  : "opacity-0  scale-95 h-0 mb-0 pointer-events-none"
              }`}
            >
              Menu
            </h2>

            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex cursor-pointer justify-center items-center rounded-[20%] hover:bg-[#003c57] transition-all duration-300 ease-in-out"
            >
              {isOpen ? (
                <MdKeyboardDoubleArrowLeft
                  size={20}
                  className="text-subtext-muted"
                />
              ) : (
                <MdKeyboardDoubleArrowRight
                  size={20}
                  className="text-subtext-muted"
                />
              )}
            </button>
          </div>
          <div className="w-full">
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.path} item={item} isOpen={isOpen} />
            ))}
          </div>
        </div>

        {/* Version Text */}
        <div
          className={`mt-auto p-4 text-center text-border-line text-xs ${
            isOpen
              ? "opacity-100 transition-opacity duration-300"
              : "opacity-0 pointer-events-none"
          }`}
        >
          Version 1.1
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
