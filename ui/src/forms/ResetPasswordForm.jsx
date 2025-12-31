"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";

const ResetPasswordForm = ({ user, onSubmit, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm the password"),
  });

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values.newPassword);
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-full ">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Reset Password</h2>
      </div>

      {/* ---------- User Information Section ---------- */}
      <div className="mb-6 p-4 border border-border rounded-lg bg-white">
        <h2 className="font-medium text-text mb-3">User Information</h2>

        {/* ✅ Avatar*/}
        <div className="flex items-center gap-4">
          {user?.name && (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sidebar-muted text-text font-semibold text-lg uppercase">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <p className="text-sm text-text font-medium">
              <strong>{user?.name}</strong>
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* ---------- Form Section ---------- */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full  bg-white ">
            <div className="border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Field name="newPassword">
                      {({ field }) => (
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-3 py-2 bg-secondary-background rounded-lg pr-10 focus:ring-2 focus:ring-primary transition ${
                            errors.newPassword && touched.newPassword
                              ? "border-red-500"
                              : "border-border"
                          }`}
                          placeholder="Enter new password"
                        />
                      )}
                    </Field>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-subtext-muted hover:text-gray-600"
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Confirm Password
                  </label>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-3 py-2 bg-secondary-background rounded-lg focus:ring-2 focus:ring-primary transition ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-500"
                            : "border-border"
                        }`}
                        placeholder="Confirm new password"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-start gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-2/7 px-6 py-2 cursor-pointer text-text-muted bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                disabled={isSubmitting}
              >
                Discard
              </button>
              <button
                type="submit"
                className="w-2/7 px-6 py-2 cursor-pointer bg-button-active text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
