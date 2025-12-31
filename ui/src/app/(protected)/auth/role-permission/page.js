"use client";

import React from "react";
import Link from "next/link";
import { FaUsers, FaShieldAlt } from "react-icons/fa";
import Can from "@/components/Can";
import withAuth from "@/components/withAuth";

const RolePermissionPage = () => {
  const menuItems = [
    {
      title: "Roles",
      description: "Manage user roles and permissions",
      route: "/auth/role-permission/roles",
      icon: <FaUsers className="text-3xl text-indigo-600" />,
      permission: "role:read",
    },
    {
      title: "Permissions",
      description: "Configure system permissions",
      route: "/auth/role-permission/permissions",
      icon: <FaShieldAlt className="text-3xl text-green-600" />,
      permission: "permission:read",
    },
    {
      title: "Assign Permission",
      description: "Assign permissions to roles",
      route: "/auth/role-permission/assign-permission",
      icon: <FaShieldAlt className="text-3xl text-blue-600" />,
      permission: "role:update",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Role & Permission Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Can key={item.route} I={item.permission}>
              <Link
                href={item.route}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-border hover:border-indigo-300"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-4 text-indigo-600 font-medium">Manage →</div>
              </Link>
            </Can>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(RolePermissionPage, ["role:read", "permission:read"]);
