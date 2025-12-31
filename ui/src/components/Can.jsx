"use client";
import { useUserContext } from "../context/UserContext";

const Can = ({ children, I, a, fallback = null }) => {
  const { can } = useUserContext();

  return can(I, a) ? <>{children}</> : <>{fallback}</>;
};

export default Can;
