import React from "react";
import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "./store";

const ProtectedRoutes = () => {
  const { isLoggedIn, userData } = useAuthStore.getState();
  return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
