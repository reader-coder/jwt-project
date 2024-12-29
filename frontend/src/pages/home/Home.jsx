import React from "react";
import styles from "./Home.module.css";
import Navbar from "../../components/navbar/Navbar";
import { useAuthStore } from "../../store";

const Home = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userData = useAuthStore((state) => state.userData);
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} userData={userData} />
      <div className="h-screen bg-black text-white flex flex-col items-center gap-4 justify-center">
        <div className="flex items-center gap-1">
          <h1 className="text-5xl">
            Hey, {userData && userData?.name ? userData?.name : "Developer"}!✌️
          </h1>
        </div>
        <p className="text-2xl">Welcome to the MERN Auth App</p>
        <h4 href="/login" className="text-xl">
          Let's get started!
        </h4>
      </div>
    </div>
  );
};

export default Home;
