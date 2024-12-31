import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "./store";
import { useLocation } from "react-router";

const ProtectedRoutes = () => {
  const { isLoggedIn, userData } = useAuthStore();
  const location = useLocation();

  if (isLoggedIn) {
    if (
      location.pathname === "/login" ||
      (location.pathname === "/verify-email" && userData?.isAccountVerified)
    ) {
      // Redirect to home if logged in and trying to access /login or /verify-email
      return <Navigate to="/" replace />;
    }
  } else {
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/verify-email"
    ) {
      // Redirect to login if not logged in and trying to access a protected route
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoutes;
