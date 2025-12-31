"use client";
import React, { useState, useEffect } from "react";
import {
  getAllPermissions,
  createPermission,
  deletePermission,
  updatePermission,
} from "@/apiServices/permissionApiServices";
import CustomDataGrid from "@/components/CustomDataGrid";
import Modal from "@/components/Modal";
import PermissionForm from "@/forms/PermissionForm";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useUserContext } from "@/context/UserContext";
import { MdEdit, MdDelete } from "react-icons/md";

const PermissionsPage = () => {
  const { token } = useUserContext();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!token) return;

      try {
        const response = await getAllPermissions(token);
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [token]);

  const handleCreateOrUpdatePermission = async (values, { setSubmitting }) => {
    try {
      if (selectedPermission) {
        await updatePermission(selectedPermission._id, values, token);
        toast.success("Permission updated successfully");
      } else {
        await createPermission(values, token);
        toast.success("Permission created successfully");
      }
      setIsModalOpen(false);
      const response = await getAllPermissions(token);
      setPermissions(response.data);
    } catch (error) {
      console.error("Error saving permission:", error);
      toast.error("Failed to save permission");
    } finally {
      setSubmitting(false);
      setSelectedPermission(null);
    }
  };

  const handleDeletePermission = async () => {
    if (!permissionToDelete) return;

    try {
      await deletePermission(permissionToDelete, token);
      // Re-fetch permissions
      const response = await getAllPermissions(token);
      setPermissions(response.data);
      toast.success("Permission deleted successfully");
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error("Failed to delete permission");
    } finally {
      setIsConfirmOpen(false);
      setPermissionToDelete(null);
    }
  };

  const openEditModal = (permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const openConfirmDialog = (id) => {
    setPermissionToDelete(id);
    setIsConfirmOpen(true);
  };

  const columns = [
    { field: "key", headerName: "Key", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "module", headerName: "Module", flex: 1 },
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
        <div className="flex gap-2">
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
        <h1 className="text-2xl font-bold">Permissions</h1>
        <button
          onClick={() => {
            setSelectedPermission(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover"
        >
          Add Permission
        </button>
      </div>
      <CustomDataGrid
        rows={permissions}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPermission ? "Edit Permission" : "Add New Permission"}
      >
        <PermissionForm
          onSubmit={handleCreateOrUpdatePermission}
          initialData={selectedPermission}
        />
      </Modal>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeletePermission}
        title="Delete Permission"
        description="Are you sure you want to delete this permission? This action cannot be undone."
      />
    </div>
  );
};

export default PermissionsPage;
