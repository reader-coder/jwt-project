import React, { useEffect, lazy, Suspense } from "react";
import styles from "./App.module.css";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import EmailVerify from "./pages/email-verify/EmailVerify";
const ResetPassword = lazy(() =>
  import("./pages/reset-password/ResetPassword")
);
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
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center">
            {/* <h5 className="text-3xl">Loading...</h5> */}
            <img src="/assets/loading.svg" alt="Loading" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerify />} />
          </Route>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
