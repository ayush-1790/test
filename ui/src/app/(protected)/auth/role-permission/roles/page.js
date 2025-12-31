"use client";
import React, { useState, useEffect } from "react";
import {
  getAllRolesApi,
  createRole,
  updateRole,
  deleteRole,
} from "@/apiServices/roleApiServices";
import CustomDataGrid from "@/components/CustomDataGrid";
import Modal from "@/components/Modal";
import RoleForm from "@/forms/RoleForm";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import { MdEdit, MdDelete } from "react-icons/md";

const RolesPage = () => {
  const { token } = useUserContext();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;

      try {
        const response = await getAllRolesApi(token);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const handleCreateOrUpdateRole = async (values, { setSubmitting }) => {
    try {
      if (selectedRole) {
        await updateRole(selectedRole._id, values, token);
        toast.success("Role updated successfully");
      } else {
        await createRole(values, token);
        toast.success("Role created successfully");
      }
      setIsModalOpen(false);
      // Re-fetch roles
      const response = await getAllRolesApi(token);
      setRoles(response.data);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role");
    } finally {
      setSubmitting(false);
      setSelectedRole(null);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete, token);
      const response = await getAllRolesApi(token);
      setRoles(response.data);
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    } finally {
      setIsConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const openConfirmDialog = (id) => {
    setRoleToDelete(id);
    setIsConfirmOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span className={params.value ? "text-green-500" : "text-red-500"}>
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-2">
          <button
            onClick={() => openEditModal(params.row)}
            className="text-blue-500 hover:text-blue-700"
          >
            <MdEdit size={20} />
          </button>
          <button
            onClick={() => openConfirmDialog(params.row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <button
          onClick={() => {
            setSelectedRole(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
        >
          Add Role
        </button>
      </div>
      <CustomDataGrid
        rows={roles}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? "Edit Role" : "Add New Role"}
      >
        <RoleForm
          onSubmit={handleCreateOrUpdateRole}
          initialData={selectedRole}
        />
      </Modal>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
      />
    </div>
  );
};

export default RolesPage;
