import React from "react";
import { Link } from "react-router";
import { IoIosUnlock, IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { useAuthStore } from "../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ isLoggedIn, userData }) => {
  const navigate = useNavigate();
  const backendUrl = useAuthStore((state) => state.backendUrl);

  const handleOtpSending = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (!data.success) {
        toast.error(data.message);
      }
      navigate("verify-email");
      toast.success("OTP has been sent to your email");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (!data.success) {
        toast(data.message);
        return;
      }
      toast.success(data.message);
      useAuthStore.persist.clearStorage(); // Clears the `localStorage`
      useAuthStore.setState({ isLoggedIn: false, userData: null }); // Resets the store
      return;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="py-5 px-16 w-full flex justify-between items-center min-h-10">
      <div className="flex gap-1 items-center">
        <IoIosUnlock className=" text-blue-600" size={40} />
        <h1 className="text-3xl text-blue-400 font-semibold">MERN Auth</h1>
      </div>
      <div className="">
        {isLoggedIn && userData ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="text-white p-6 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <p>{userData.name[0].toUpperCase()}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!userData.isAccountVerfied && (
                <DropdownMenuItem>
                  <button onClick={handleOtpSending}>Verify Email</button>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            className="py-2 px-4 bg-blue-600 rounded-full flex justify-center gap-1 items-center text-white hover:bg-blue-700 transition-all hover:text-white"
          >
            Login
            <IoIosArrowRoundForward size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
