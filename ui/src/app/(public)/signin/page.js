"use client";

import React, { useState } from "react";
// Import yup for validation
import * as Yup from "yup";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useFormik } from "formik";
import { signinApi } from "@/apiServices/authApiServices.js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { jwtDecode } from "jwt-decode";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import Loader from "@/components/Loader";

const inputFields = [
  {
    name: "email",
    type: "email",
    placeholder: "Enter Email Address",
    label: "Email Address",
  },
  {
    name: "password",
    type: "password", // Initial type, will be toggled
    placeholder: "Enter Password",
    label: "Password",
  },
];

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const router = useRouter();
  const { saveAuth } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);

      return decoded?.role || null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const redirectUser = (token) => {
    const role = getRoleFromToken(token);
    const userRole = role ? role.toLowerCase() : "";
    setLoading(true); // Start loading before redirect

    const rolePaths = {
      admin: "/",
      manager: "/",
      user: "/blogs",
    };

    if (userRole && rolePaths[userRole]) {
      router.push(rolePaths[userRole]);
    } else if (userRole) {
      // Default path for any other dynamic role
      router.push("/");
    } else {
      router.push("/");
      toast.error("You do not have permission to access this application.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (credential) => {
    try {
      const loginInfo = await signinApi({ authToken: credential });
      // console.log(loginInfo, "loginInfo");

      if (loginInfo?.success && loginInfo?.token) {
        saveAuth(loginInfo.token);
        toast.success("Login successful!");
        redirectUser(loginInfo.token);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage === "Your account is deactivated.") {
        toast.error(
          "Your account is under verification. Kindly be patient and allow up to 24 hours for activation.",
          { autoClose: 5000 }
        );
      } else {
        toast.error("Something went wrong during login.");
      }
    }
  };

  const handleLoginSuccess = ({ credential }) => {
    if (credential) {
      handleGoogleLogin(credential);
    } else {
      toast.error("Invalid Google response");
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const loginInfo = await signinApi(values);
        console.log(loginInfo);

        if (loginInfo?.success && loginInfo?.token) {
          saveAuth(loginInfo.token);
          toast.success("Login successful!");
          redirectUser(loginInfo.token);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message;

        if (errorMessage === "Your account is deactivated.") {
          toast.error(
            "Your account is under verification. Kindly be patient and allow up to 24 hours for activation.",
            { autoClose: 5000 }
          );
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="fixed h-screen overflow-y-hidden overflow-x-hidden inset-0 flex justify-center items-center bg-text p-5 "
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background blobs */}

        <div className="flex w-full max-w-7xl mx-auto z-10">
          {/* Left Side - Branding */}
          <div className="flex-1 flex flex-col justify-center text-white px-16 py-20">
            <div className="max-w-lg ">
              <h1 className="text-white text-6xl font-bold leading-none  ">
                Revision
              </h1>
              <h1 className=" text-5xl leading-none mb-4 text-primary">
                Tool
              </h1>
              <p className="text-subtext-muted  leading-relaxed font-weight-400">
                Summarize, structure, and streamline every revision. Turn
                scattered client feedback into clear, actionable insights for
                faster collaboration and better design outcomes.
              </p>
            </div>
          </div>

          {/* right side  */}
          <div className="bg-white text-text z-10 shadow-2xl rounded-lg p-8 md:p-8 max-w-lg w-full space-y-6 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-start mb-10">
              <div
                className="relative"
                style={{
                  width: "180px",
                  height: "45px",
                  backgroundImage: "url('/logo.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>

            <h2 className="text-3xl font-bold text-text">Login</h2>

            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {/* Dynamic Input Rendering */}
              {inputFields.map((field) => (
                <div className="relative" key={field.name}>
                  <h3 className="text-text mb-3">{field.label}</h3>
                  <input
                    type={
                      field.name === "password" && showPassword
                        ? "text"
                        : field.type
                    }
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full py-2 px-3 border border-sidebar-muted text-text placeholder:text-subtext-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // Add handleBlur for validation on touch
                    value={formik.values[field.name]}
                  />

                  {/* Password Toggle Icon */}
                  {field.name === "password" && (
                    <span
                      className="absolute top-3/4 right-3 transform -translate-y-1/2 text-text-muted cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  )}

                  {/* Validation Error Message */}
                  {formik.touched[field.name] && formik.errors[field.name] ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors[field.name]}
                    </div>
                  ) : null}
                </div>
              ))}
              {/* End Dynamic Input Rendering */}

              <button
                type="submit"
                // Disable button if form is invalid or submitting
                disabled={formik.isSubmitting}
                className="w-full  text-white py-2 rounded-lg bg-button-active hover:bg-primary-hover hover:scale-[1.02] transition cursor-pointer"
              >
                Login
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link
                href="/auth/forget-password"
                className="text-primary hover:text-primary-hover text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="flex items-center justify-center">
                <div className="w-1/4 border-t border-subtext-muted"></div>
                <span className="px-4 text-sm text-subtext-muted bg-white">
                  OR
                </span>
                <div className="w-1/4 border-t border-subtext-muted"></div>
              </div>
            </div>

            <div className="flex w-full  flex-col items-center justify-center">
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
                <div className="flex w-full flex-col items-stretch justify-center">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    shape="square"
                    text="signin_with"
                    style={{ width: "100%" }}
                  />
                </div>
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
