import React, { useEffect } from "react";
import styles from "./App.module.css";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import EmailVerify from "./pages/email-verify/EmailVerify";
import ResetPassword from "./pages/reset-password/ResetPassword";
import { useAuthStore } from "./store";
import axios from "axios";
import ProtectedRoutes from "./ProtectedRoutes";

const App = () => {
  const { backendUrl } = useAuthStore.getState();
  useEffect(() => {
    const updateData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(backendUrl + "/api/user/data");
        if (!data.success) {
          useAuthStore.setState({ isLoggedIn: false, userData: null });
        }
        useAuthStore.setState({ isLoggedIn: true, userData: data.userData });
      } catch (error) {
        useAuthStore.setState({ isLoggedIn: false, userData: null });
      }
    };
    updateData();
  }, []);
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
