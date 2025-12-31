// @/forms/BulkUserForm.js
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  MdGroupAdd,
  MdAdd,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { createMultipleUsersApi } from "@/apiServices/authApiServices";
import { getAllRoles } from "@/apiServices/roleApiServices";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { UserIcon } from "@/components/CustomIcons";

const BulkUserForm = ({ token, onSuccess, onClose }) => {
  const [showPasswords, setShowPasswords] = useState({});
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

  const togglePasswordVisibility = (index) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const userSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const validationSchema = Yup.object({
    users: Yup.array()
      .of(userSchema)
      .min(1, "At least one user is required")
      .test("unique-emails", "Duplicate emails found", function (users) {
        if (!users) return true;
        const emails = users
          .map((user) => user.email?.toLowerCase())
          .filter(Boolean);
        const uniqueEmails = new Set(emails);
        return emails.length === uniqueEmails.size;
      }),
  });

  const initialValues = {
    users: [{ name: "", email: "", password: "", role: "user" }],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createMultipleUsersApi(values.users, token);
      toast.success("Users created successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error creating users:", error);
      toast.error("Failed to create users");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-5xl mx-auto max-h-[80vh] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        {/* <MdGroupAdd className="h-6 w-6 text-primary" /> */}
        <h2 className="text-lg md:text-2xl font-bold text-text">
          Create Users
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form className="space-y-4">
            <FieldArray name="users">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="space-y-4  overflow-y-auto">
                    {values.users.map((user, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-text">
                            #User {index + 1} Information
                          </h3>
                          {values.users.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-text-muted  hover:text-text-muted hover:bg-secondary-background rounded-2xl p-2 cursor-pointer"
                            >
                              <RxCross2 />
                            </button>
                          )}
                        </div>

                        {/* ✅ Avatar preview or user icon */}
                        <div className="flex justify-start mb-3">
                          <div className="w-15 h-15 flex items-center justify-center rounded-full bg-secondary-background text-text font-semibold text-lg uppercase shadow-md">
                            {user.name ? (
                              getInitials(user.name)
                            ) : (
                              <UserIcon
                                size={34}
                                viewBox={"0 0 20 20"}
                                className="text-lg text-text opacity-90"
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {/* Name Field */}
                          <div>
                            <label className="block text-xs font-medium text-text mb-1">
                              Name
                            </label>
                            <Field name={`users[${index}].name`}>
                              {({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={`w-full px-3 py-2 text-sm border border-border rounded   ${
                                    errors.users?.[index]?.name &&
                                    touched.users?.[index]?.name
                                      ? "border-red-500"
                                      : "border-border"
                                  }`}
                                  placeholder="Enter name"
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name={`users[${index}].name`}
                              component="p"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Email Field */}
                          <div>
                            <label className="block text-xs font-medium text-text mb-1">
                              Email
                            </label>
                            <Field name={`users[${index}].email`}>
                              {({ field }) => (
                                <input
                                  {...field}
                                  type="email"
                                  className={`w-full px-3 py-2 text-sm border rounded ${
                                    errors.users?.[index]?.email &&
                                    touched.users?.[index]?.email
                                      ? "border-red-500"
                                      : "border-secondary-background"
                                  }`}
                                  placeholder="Enter email"
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name={`users[${index}].email`}
                              component="p"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          {/* Password Field */}
                          <div>
                            <label className="block text-xs font-medium text-text mb-1">
                              Password
                            </label>
                            <div className="relative">
                              <Field name={`users[${index}].password`}>
                                {({ field }) => (
                                  <input
                                    {...field}
                                    type={
                                      showPasswords[index] ? "text" : "password"
                                    }
                                    className={`w-full px-3 py-2 pr-10 text-sm border rounded   ${
                                      errors.users?.[index]?.password &&
                                      touched.users?.[index]?.password
                                        ? "border-red-500"
                                        : "border-secondary-background"
                                    }`}
                                    placeholder="Enter password"
                                  />
                                )}
                              </Field>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(index)}
                                className="absolute right-3 top-2.5 text-subtext-muted hover:text-gray-600"
                              >
                                {showPasswords[index] ? (
                                  <MdVisibilityOff className="h-4 w-4" />
                                ) : (
                                  <MdVisibility className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name={`users[${index}].password`}
                              component="p"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                          {/* role */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <Field name={`users[${index}].role`}>
                              {({ field }) => (
                                <select
                                  {...field}
                                  className={`w-full px-2 py-2 text-sm border rounded   ${
                                    errors.users?.[index]?.role &&
                                    touched.users?.[index]?.role
                                      ? "border-red-500"
                                      : "border-border"
                                  }`}
                                >
                                  <option value="">Select Role</option>
                                  {roles.map((role) => (
                                    <option
                                      key={role._id || role.id}
                                      value={role.name}
                                    >
                                      {role.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </Field>
                            <ErrorMessage
                              name={`users[${index}].role`}
                              component="p"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.users && typeof errors.users === "string" && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                      {errors.users}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      push({
                        name: "",
                        email: "",
                        password: "",
                        role: "designer",
                      });
                    }}
                    className="flex items-center gap-2 cursor-pointer text-button-active rounded-lg transition"
                  >
                    <MdAdd />
                    Add Another User
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 cursor-pointer border border-sidebar-muted text-text-muted rounded-lg hover:bg-gray-100 transition min-w-[120px]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer bg-button-active text-white rounded-lg hover:bg-primary transition min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating Users..."
                  : `Create ${values.users.length} User${
                      values.users.length > 1 ? "s" : ""
                    }`}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BulkUserForm;
