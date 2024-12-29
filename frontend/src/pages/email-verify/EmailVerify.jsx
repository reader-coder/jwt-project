import React, { useRef, useState } from "react";
import styles from "./EmailVerify.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "@/store";
import { useNavigate } from "react-router";
import { getUserData } from "@/actions";

const EmailVerify = () => {
  const [pending, setPending] = useState(false);
  const { backendUrl } = useAuthStore.getState();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

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

  const handleOtpSubmission = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const otp = Object.values(formValues).join("");
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        {
          otp,
        }
      );
      if (!data.success) {
        toast.error(data.message);
      }
      await getUserData();
      navigate("/");
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div>
        <form
          action=""
          className="bg-blue-950 p-8 rounded-lg shadow-lg w-96 text-sm flex flex-col items-center"
          onSubmit={handleOtpSubmission}
        >
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl text-white font-semibold">
              Verify Account
            </h2>
            <p className="text-blue-500">
              Enter the 6 digit OTP to verify your email
            </p>
          </div>
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

export default EmailVerify;
