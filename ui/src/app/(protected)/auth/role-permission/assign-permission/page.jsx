"use client";
import React, { useState, useEffect } from "react";
import { getAllRolesApi, updateRole } from "@/apiServices/roleApiServices";
import { getAllPermissions } from "@/apiServices/permissionApiServices";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import Can from "@/components/Can";
import withAuth from "@/components/withAuth";

const AssignPermissionPage = () => {
  const { token } = useUserContext();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [rolesRes, permissionsRes] = await Promise.all([
          getAllRolesApi(token),
          getAllPermissions(token),
        ]);

        if (rolesRes?.data) {
          setRoles(rolesRes.data);
        }
        if (permissionsRes?.data) {
          setPermissions(permissionsRes.data);
        }
      } catch (error) {
        toast.error("Failed to fetch roles or permissions");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find((r) => r._id === selectedRole);
      setAssignedPermissions(role ? role.permissions.map((p) => p._id) : []);
    } else {
      setAssignedPermissions([]);
    }
  }, [selectedRole, roles]);

  const handlePermissionToggle = (permissionId) => {
    setAssignedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    setIsLoading(true);
    try {
      const roleToUpdate = roles.find((r) => r._id === selectedRole);
      if (!roleToUpdate) {
        toast.error("Selected role not found.");
        return;
      }

      const roleData = {
        ...roleToUpdate,
        permissions: assignedPermissions,
      };

      await updateRole(selectedRole, roleData, token);
      toast.success("Permissions assigned successfully");

      // Refetch roles to get the latest data
      const rolesRes = await getAllRolesApi(token);
      if (rolesRes?.data) {
        setRoles(rolesRes.data);
      }
    } catch (error) {
      toast.error("Failed to assign permissions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-bg-surface text-text">
      <h1 className="text-3xl font-bold mb-8">Assign Permissions to Role</h1>
      <div className="mb-4">
        <label htmlFor="role-select" className="block text-sm font-medium ">
          Select Role
        </label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-border focus:outline-none  sm:text-sm rounded-md"
        >
          <option value="">-- Select a role --</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissions.map((permission) => (
          <div key={permission._id} className="flex items-center">
            <input
              type="checkbox"
              id={`perm-${permission._id}`}
              checked={assignedPermissions.includes(permission._id)}
              onChange={() => handlePermissionToggle(permission._id)}
              disabled={!selectedRole}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
            />
            <label
              htmlFor={`perm-${permission._id}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {permission.key}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Can I="role:update">
          <button
            onClick={handleSave}
            disabled={isLoading || !selectedRole}
            className="px-6 py-2 text-white bg-primary rounded-md hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-2 disabled:bg-gray-400"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </Can>
      </div>
    </div>
  );
};

export default withAuth(AssignPermissionPage, "role:update");
