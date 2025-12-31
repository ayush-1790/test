"use client";

import { useEffect, useMemo, useState } from "react";
import { IoPeopleOutline } from "react-icons/io5";
import { Box, Tooltip, IconButton } from "@mui/material";
import Loader from "@/components/Loader";
import CustomDataGrid from "@/components/CustomDataGrid";
import { useUserContext } from "@/context/UserContext";
import Modal from "@/components/Modal";
import { FiDownloadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  adminResetUserPasswordApi,
  getAllUsersApi,
  deleteUserApi,
} from "@/apiServices/authApiServices";
import UserForm from "@/forms/UserForm";
import ResetPasswordForm from "@/forms/ResetPasswordForm";
import BulkUserForm from "@/forms/BulkUserForm";
import {
  UserIcon,
  AddUserIcon,
  EditIcon,
  LockIcon,
  BinIcon,
} from "@/components/CustomIcons";
import { IoTrashOutline } from "react-icons/io5";

const AllUsers = () => {
  const { token } = useUserContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsersApi(token);
        setUsers(response.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [token]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmailInitials = (email) => {
    if (!email) return "??";
    const [username] = email.split("@");
    return username
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const truncateText = (text, maxLength = 25) =>
    text && text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;

  const getStatusColor = (isActive, isVerified) => {
    if (isActive && isVerified) return "text-green-600";
    if (!isActive && !isVerified) return "text-red-600";
    return "text-yellow-600";
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await adminResetUserPasswordApi(userId, newPassword, token);
      toast("Password reset successfully!");
      setOpenResetModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast("Failed to reset password");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserApi(userId, token);
      toast.success("User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setOpenDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "User Details",
      flex: 1.6,
      renderCell: (params) => (
        <Box className="flex items-center gap-2 py-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-sm">
            {getEmailInitials(params.row.email)}
          </div>
          <Box>
            <Tooltip title={params.row.fullName} arrow>
              <div className="text-sm font-normal text-text cursor-pointer">
                {truncateText(params.value)}
              </div>
            </Tooltip>
            {params.row.email && (
              <Tooltip title={params.row.email} arrow>
                <div className="text-xs text-text-muted">
                  {truncateText(params.row.email, 30)}
                </div>
              </Tooltip>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        const role = params.value || "N/A";
        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <div className={`text-sm text-text py-1 rounded`}>{role}</div>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const user = params.row.originalData;
        const isActive = user.is_active;
        const isVerified = user.is_verified;

        const bothStatusColor = getStatusColor(isActive, isVerified);

        if (bothStatusColor === "text-green-600") {
          return (
            <Box className="h-full flex flex-col justify-center">
              <span className="text-sm font-medium text-green-600">Active</span>
              <span className="text-sm font-medium text-green-600">
                Verified
              </span>
            </Box>
          );
        }

        if (bothStatusColor === "text-red-600") {
          return (
            <Box className="h-full flex flex-col justify-center">
              <span className="text-sm font-medium text-red-600">Inactive</span>
              <span className="text-sm font-medium text-red-600">
                Unverified
              </span>
            </Box>
          );
        }

        return (
          <Box className="h-full flex flex-col justify-center">
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`text-sm font-medium ${
                isVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </Box>
        );
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1.2,
      renderCell: (params) => (
        <Box className="h-full flex flex-col justify-center ">
          <div className="text-sm font-medium text-text-muted">
            {params.row.createdByEmail || "N/A"}
          </div>
          <div className="text-xs font-light text-text-muted">
            {params.row.createdAt
              ? formatDateTime(params.row.createdAt)
              : "N/A"}
          </div>
        </Box>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Last Updated By",
      flex: 1.2,
      renderCell: (params) => (
        <Box className="h-full flex flex-col justify-center ">
          <div className="text-sm font-medium text-text-muted">
            {params.row.updatedByEmail || "N/A"}
          </div>
          <div className="text-xs font-light text-text-muted">
            {params.row.updatedAt
              ? formatDateTime(params.row.updatedAt)
              : "N/A"}
          </div>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Box className="flex items-center h-full justify-center gap-1">
          <Tooltip title="Edit user" arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(params.row.originalData);
                setOpenModal(true);
              }}
              size="small"
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
            >
              <EditIcon
                size={24}
                stroke="#00A3E6"
                strokeWidth={1.3}
                viewBox={"0 0 20 20"}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Password" arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(params.row.originalData);
                setOpenResetModal(true);
              }}
              size="small"
              className="text-orange-600 hover:text-orange-900 hover:bg-orange-50"
            >
              <LockIcon size={24} stroke="#155dfc" viewBox={"0 0 23 23"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User" arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(params.row.originalData);
                setOpenDeleteModal(true);
              }}
              size="small"
              className="text-red-600 hover:text-red-900 hover:bg-red-50"
            >
              <IoTrashOutline className="w-5 h-5 text-red-500" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Build ALL rows (no manual filtering/search/pagination here)
  const rows = useMemo(
    () =>
      (users || []).map((user) => ({
        id: user.id,
        name: truncateText(user.name),
        fullName: user.name,
        email: user.email,
        role: user.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
          : "N/A",
        status: `${user.is_active ? "Active" : "Inactive"}${
          user.is_verified ? " / Verified" : ""
        }`,
        createdByEmail: user.createdBy?.email,
        updatedByEmail: user.updatedBy?.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        originalData: user,
      })),
    [users]
  );

  const totalItems = rows.length;

  return (
    <div className="overflow-x-hidden h-auto mix-w-screen text-text bg-white rounded-3xl m-4 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4">
        {/* Left section: Icon + text */}
        <div className="flex items-center gap-2">
          <UserIcon size={40} stroke="#00212E" viewBox={"0 0 20 20"} />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-text">
              All Users
            </h1>
            <p className="text-sm text-gray-500">
              {totalItems} User{totalItems !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setOpenBulkModal(true)}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-lg bg-button-active text-white hover:bg-primary-hover transition"
            style={{ width: "160px", height: "40px" }}
          >
            <AddUserIcon size={24} stroke="#ffffff" viewBox={"0 0 20 20"} />
            <h2 className="text-sm">Add New User</h2>
          </button>
        </div>
      </div>

      <div className="pl-5 pr-5 pt-5 h-auto flex flex-col">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <div className="w-full text-center py-20 text-gray-500">
            <IoPeopleOutline className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">No users found</p>
            <p className="text-sm">No users are available at the moment.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <CustomDataGrid
              columns={columns}
              rows={rows}
              loading={false}
              rowIdField="id"
              onRowClick={() => {}}
              rowHeight={68}
              headerHeight={56}
              // Let MUI DataGrid handle pagination + quick filter
              toolbarProps={{ showQuickFilter: true }}
              pageSizeOptions={[25, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* Edit user */}
      <Modal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
        }}
      >
        <UserForm
          selectedUser={selectedUser}
          token={token}
          onSuccess={async () => {
            const updated = await getAllUsersApi(token);
            setUsers(updated.users || []);
            setOpenModal(false);
            setSelectedUser(null);
          }}
          onClose={() => {
            setOpenModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      {/* Reset password */}
      <Modal
        isOpen={openResetModal}
        onClose={() => {
          setOpenResetModal(false);
          setSelectedUser(null);
        }}
      >
        <ResetPasswordForm
          user={selectedUser}
          onSubmit={(newPassword) =>
            handleResetPassword(selectedUser?._id, newPassword)
          }
          onClose={() => {
            setOpenResetModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      {/* Bulk create */}
      <Modal isOpen={openBulkModal} onClose={() => setOpenBulkModal(false)}>
        <BulkUserForm
          token={token}
          onSuccess={async () => {
            const updated = await getAllUsersApi(token);
            setUsers(updated.users || []);
            setOpenBulkModal(false);
          }}
          onClose={() => setOpenBulkModal(false)}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedUser(null);
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center max-w-md text-center">
            <div className="bg-[#ED2D2D33] p-3 rounded-full flex items-center justify-center mb-4">
              <BinIcon
                size={26}
                stroke="#ED2D2D"
                strokeWidth={2}
                viewBox={"0 0 34 34"}
              />
            </div>
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion?</h2>
            <p className="text-gray-600 mb-6">
              You’re about to delete{" "}
              <strong>{selectedUser?.name || "this user"}</strong>. Once
              deleted, their account and related data can’t be recovered.
            </p>
            <div className="flex justify-center gap-4 w-full">
              <button
                onClick={() => {
                  setOpenDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 w-1/2 border border-sidebar-muted text-text-muted rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser?._id)}
                className="px-4 py-2 w-1/2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllUsers;
