"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

const SidebarMenuItem = ({ item, isOpen }) => {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    item.children?.some((child) => child.path === pathname)
  );

  const isSelected =
    pathname === item.path ||
    (item.children && item.children.some((child) => child.path === pathname));

  if (item.children) {
    return (
      <div className={isSelected ? "bg-[#003c57] rounded-md" : ""}>
        <button
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
          className={`w-full flex items-center justify-between p-2 text-white hover:bg-[#003c57] rounded-md ${
            isOpen ? "" : "justify-center"
          }`}
        >
          <div className="flex items-center">
            {item.icon}
            {isOpen && <span className="ml-2">{item.title}</span>}
          </div>
          {isOpen && (
            <MdExpandMore
              className={`transition-transform ${
                isSubMenuOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        {isSubMenuOpen && isOpen && (
          <div className="ml-4">
            {item.children.map((child) => (
              <SidebarMenuItem key={child.path} item={child} isOpen={isOpen} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.path}>
      <div
        className={`w-full flex items-center p-2 text-white hover:bg-[#003c57] rounded-md ${
          isOpen ? "" : "justify-center"
        } ${isSelected ? "bg-[#003c57]" : ""}`}
      >
        {item.icon}
        {isOpen && <span className="ml-2">{item.title}</span>}
      </div>
    </Link>
  );
};

export default SidebarMenuItem;
