"use client";
import { useUserContext } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader"; 

const withAuth = (Component, permission) => {
  const AuthComponent = (props) => {
    const { isAuthenticated, loading, can } = useUserContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/signin");
      }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
      return <Loader />;
    }

    if (permission && !can(permission)) {
      router.push("/unauthorized");
      return null;
    }

    return <Component {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
