import React, { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { useAuthStore } from "../../store";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getUserData } from "../../actions";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const backendUrl = useAuthStore((state) => state.backendUrl);
  const userData = useAuthStore((state) => state.userData);

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const { username, email, password } = formValues;
    try {
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name: username,
          email,
          password,
        });
        if (data.success) {
          await getUserData();
          setPending(false);
          navigate("/");
          toast.success(`Welcome ${userData.name}`);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          await getUserData();
          setPending(false);
          navigate("/");
          toast.success("Welcome");
        }
      }
    } catch (error) {
      setPending(false);
      toast.error(error.response.data.message);
    }
  };

  const handleFormState = () => {
    setState((prev) => {
      if (prev !== "Sign Up") {
        return "Sign Up";
      }
      return "Login";
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-950 py-8 px-16 gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl text-white font-semibold">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-blue-500">
            {state === "Sign Up"
              ? "Create your account"
              : "Login to your account"}
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleFormSubmission}>
          {state === "Sign Up" && (
            <div className="bg-blue-900 flex items-center py-1 px-3 rounded-full gap-1">
              <LiaUser className="text-blue-200" />
              <input
                className="bg-transparent focus:outline-none text-white py-1 px-2"
                type="text"
                name="username"
                placeholder="Username"
              />
            </div>
          )}
          <div className="bg-blue-900 flex items-center py-1 px-3 rounded-full gap-1">
            <MdOutlineMailOutline className="text-blue-200" />
            <input
              className="bg-transparent focus:outline-none text-white py-1 px-2"
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="bg-blue-900 flex items-center py-1 px-3 rounded-full gap-1">
            <IoMdLock className="text-blue-200" />
            <input
              className="bg-transparent focus:outline-none text-white py-1 px-2"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="w-full flex items-center justify-start">
            {state !== "Sign Up" && (
              <a
                href="/reset-password"
                className="text-blue-500 cursor-pointer"
              >
                Forgot password?
              </a>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-full py-2 text-white"
            disabled={pending}
          >
            {pending ? "Please wait" : state}
          </button>
        </form>
        <div className="text-gray-500 flex flex-col items-center">
          {state === "Sign Up" ? (
            <div>
              Already registered?{" "}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={handleFormState}
              >
                Login
              </span>
            </div>
          ) : (
            <div>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={handleFormState}
              >
                Sign up
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
