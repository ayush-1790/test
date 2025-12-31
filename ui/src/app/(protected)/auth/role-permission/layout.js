"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Roles", route: "/auth/role-permission/roles" },
    { label: "Permissions", route: "/auth/role-permission/permissions" },
    { label: "Assign Permission", route: "/auth/role-permission/assign-permission" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          Role & Permission Management
        </h1>
        <nav className="flex space-x-4 border-b border-border">
          {menuItems.map((item) => (
            <Link
              key={item.route}
              href={item.route}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                pathname === item.route
                  ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500"
                  : "hover:text-text hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default layout;
