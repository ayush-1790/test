import { FaUsers, FaShieldAlt, FaUserPlus, FaBlog, FaTachometerAlt } from "react-icons/fa";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: <FaTachometerAlt />,
    permission: "dashboard:read",
  },
  {
    title: "Blog",
    path: "/blogs",
    icon: <FaBlog />,
    permission: "blog:read",
  },
  {
    title: "Access Control",
    path: "/auth/role-permission",
    icon: <FaUsers />,
    permission: ["role:read", "permission:read", "role:update"],
    children: [
      {
        title: "Roles",
        path: "/auth/role-permission/roles",
        icon: <FaUsers />,
        permission: "role:read",
      },
      {
        title: "Permissions",
        path: "/auth/role-permission/permissions",
        icon: <FaShieldAlt />,
        permission: "permission:read",
      },
      {
        title: "Assign Permission",
        path: "/auth/role-permission/assign-permission",
        icon: <FaUserPlus />,
        permission: "role:update",
      },
    ],
  },
];
