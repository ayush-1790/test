"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiUserPlus, FiEdit } from "react-icons/fi";
import { signupApi, updateUserApi } from "@/apiServices/authApiServices";
import { getAllRoles } from "@/apiServices/roleApiServices";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { toast } from "react-toastify";

const getValidationSchema = (isEditing) =>
  Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: isEditing
      ? Yup.string().notRequired()
      : Yup.string()
          .min(6, "Minimum 6 characters")
          .required("Password is required"),
  });

const UserForm = ({ selectedUser, token, onClose, onSuccess }) => {
  const isEditing = !!selectedUser;
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles(token);
        setRoles(response.roles || response.data || []);
      } catch (error) {
        console.error("Failed to fetch roles", error);
        toast.error("Failed to load roles");
      }
    };
    if (token) fetchRoles();
  }, [token]);

  const initialValues = {
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    role: selectedUser?.role || "",
    password: "",
    is_active: selectedUser?.is_active ?? true,
    is_verified: selectedUser?.is_verified ?? true,
    createdBy: selectedUser?.createdBy?.email || "N/A",
    updatedBy: selectedUser?.updatedBy?.email || "N/A",
  };

  const userFormFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roles.map((r) => ({ value: r.name, label: r.name })),
    },
    ...(!isEditing
      ? [{ name: "password", label: "Password", type: "password" }]
      : []),
    { name: "createdBy", label: "Created By", type: "text", readOnly: true },
    { name: "updatedBy", label: "Updated By", type: "text", readOnly: true },
  ];

  const dropdownFields = [
    {
      name: "is_active",
      label: "Active Status",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ],
    },
    {
      name: "is_verified",
      label: "Verification Status",
      options: [
        { value: true, label: "Verified" },
        { value: false, label: "Unverified" },
      ],
    },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(isEditing)}
      onSubmit={async (values, actions) => {
        try {
          const processedValues = {
            ...values,
            is_active: values.is_active === "true" || values.is_active === true,
            is_verified:
              values.is_verified === "true" || values.is_verified === true,
          };

          if (isEditing) {
            await updateUserApi(selectedUser._id, processedValues, token);
            toast.success(`User "${values.name}" updated successfully!`);
          } else {
            await signupApi(processedValues, token);
            toast.success(`User "${values.name}" created successfully!`);
          }

          actions.setSubmitting(false);
          onSuccess();
        } catch (err) {
          console.error("Form submission error:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong";
          toast.error(
            isEditing
              ? `Failed to update user: ${errorMessage}`
              : `Failed to create user: ${errorMessage}`
          );
          actions.setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => {
        // ✅ Helper to get initials
        const getInitials = (name) => {
          if (!name) return "";
          const parts = name.trim().split(" ");
          if (parts.length === 1) return parts[0][0].toUpperCase();
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        };

        return (
          <Form>
            {/* Header section */}
            <div className="flex items-center justify-between mb-4 ">
              <div className="flex items-center  text-xl font-semibold text-text gap-2">
                {isEditing ? (
                  <>
                    {/* <FiEdit className="text-lg" /> */}
                    <h1 className="text-lg md:text-2xl font-bold">
                      Update User Info
                    </h1>
                  </>
                ) : (
                  <>
                    {/* <FiUserPlus className="text-lg" /> */}
                    <h1 className="text-lg md:text-3xl font-bold">
                      Create User
                    </h1>
                  </>
                )}
              </div>
            </div>

            {/* Main form container */}
            <div className="border border-border rounded-2xl  p-1 md:p-4">
              {/* ✅ Avatar below header, above fields */}
              {isEditing && values.name && (
                <div className="flex  mt-2 mb-6 justify-start">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sidebar-muted text-text font-semibold text-xl uppercase shadow-md">
                    {getInitials(values.name)}
                  </div>
                </div>
              )}

              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userFormFields.map((field) => {
                    if (field.type === "select") {
                      return (
                        <div
                          key={field.name}
                          className="flex flex-col col-span-1 "
                        >
                          <label
                            htmlFor={field.name}
                            className="font-medium mb-1 text-sm text-text "
                          >
                            {field.label}
                          </label>
                          <div className="relative">
                            <Field
                              as="select"
                              id={field.name}
                              name={field.name}
                              className="appearance-none text-text px-3 py-2 rounded-md bg-secondary-background text-sm focus:outline-none focus:ring w-full pr-8"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </Field>
                            <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-text">
                              <IoChevronDown />
                            </div>
                          </div>
                          <ErrorMessage
                            name={field.name}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={field.name}
                        className="flex flex-col col-span-1"
                      >
                        <label
                          htmlFor={field.name}
                          className="font-medium mb-1 text-sm"
                        >
                          {field.label}
                        </label>
                        {field.type === "password" ? (
                          <div className="relative">
                            <Field
                              id={field.name}
                              name={field.name}
                              type={showPassword ? "text" : "password"}
                              className="border px-3 py-2 rounded-md text-sm w-full pr-10 focus:outline-none focus:ring"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        ) : (
                          <Field
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            disabled={field.readOnly}
                            className={`border border-secondary-background px-3 py-2 rounded-md text-sm ${
                              field.readOnly
                                ? "bg-secondary-background text-text cursor-not-allowed"
                                : "bg-secondary-background text-text focus:outline-none focus:ring"
                            }`}
                          />
                        )}
                        <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {dropdownFields.map((field) => (
                    <div key={field.name} className="flex flex-col col-span-1">
                      <label
                        htmlFor={field.name}
                        className="font-medium mb-1 text-sm text-text"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          id={field.name}
                          name={field.name}
                          className="border-secondary-background bg-secondary-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring w-full text-text appearance-none pr-8"
                        >
                          {field.options.map((opt) => (
                            <option
                              key={opt.value.toString()}
                              value={opt.value}
                            >
                              {opt.label}
                            </option>
                          ))}
                        </Field>
                        <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-text">
                          <IoChevronDown />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-start gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-sidebar-muted text-text-muted rounded-lg hover:bg-gray-100 transition min-w-[120px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition min-w-[120px]"
                >
                  {isSubmitting
                    ? "Processing..."
                    : isEditing
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UserForm;
