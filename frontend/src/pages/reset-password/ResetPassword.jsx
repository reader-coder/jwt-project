import React, { useState, useRef } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { useAuthStore } from "@/store";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { IoMdLock } from "react-icons/io";
import axios from "axios";

const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState("email");
  const [userEmail, setUserEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backendUrl } = useAuthStore.getState();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleFormSubmissions = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    if (currentStep === "email") {
      try {
        const { email } = formValues;
        if (!email) {
          toast.error("Please enter your email");
        }
        const { data } = await axios.post(
          backendUrl + "/api/auth/send-reset-otp",
          {
            email,
          }
        );
        if (!data.success) {
          toast.error("Email not found");
        }
        toast.success("OTP sent successfully");
        setUserEmail(email);
        setCurrentStep("otp");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else if (currentStep === "otp") {
      try {
        const otp = Object.values(formValues).join("");
        console.log(otp);
        if (otp.length < 6) {
          toast.error("Invalid OTP");
        }
        const { data } = await axios.post(
          backendUrl + "/api/auth/verify-reset-otp",
          { email: userEmail, otp }
        );
        if (!data.success) {
          toast.error("Please recheck the OTP");
        }
        setUserOtp(otp);
        setCurrentStep("password");
        toast.success("Enter the new password");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else if (currentStep === "password") {
      try {
        const { password } = formValues;
        if (!password) {
          toast.error("Enter your new password");
        }
        const { data } = await axios.post(
          backendUrl + "/api/auth/reset-password",
          {
            email: userEmail,
            otp: userOtp,
            newPassword: password,
          }
        );
        if (!data.success) {
          toast.error(data.message);
        }
        navigate("/");
        toast.success("Password has been updated successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div>
        <form
          action=""
          className="bg-blue-950 p-8 rounded-lg shadow-lg w-96 text-sm flex flex-col items-center"
          onSubmit={(e) => handleFormSubmissions(e)}
        >
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl text-white font-semibold">
              Reset Password
            </h2>
            <p className="text-blue-500">
              {currentStep === "email" && "Enter your registered email ID"}
              {currentStep === "otp" && " Enter the OTP"}
              {currentStep === "password" && "Enter the new password"}
            </p>
          </div>
          {currentStep === "email" && (
            <div className="bg-blue-900 flex items-center py-1 px-3 rounded-full gap-1 my-8">
              <MdOutlineMailOutline className="text-blue-200" />
              <input
                className="bg-transparent focus:outline-none text-white py-1 px-2"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
          )}
          {currentStep === "otp" && (
            <div
              className="flex justify-between mb-8 mt-8 gap-2"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    name={`input${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 rounded-md text-center text-xl"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
          )}
          {currentStep === "password" && (
            <div className="bg-blue-900 flex items-center py-1 px-3 rounded-full gap-1 mb-8">
              <IoMdLock className="text-blue-200" />
              <input
                className="bg-transparent focus:outline-none text-white py-1 px-2"
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-full px-16 py-2 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
