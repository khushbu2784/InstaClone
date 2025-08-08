// src/components/FullScreenLoader.jsx
import React from "react";
import image from "@/assets/image.png"; // ✅ use your own logo or replace path

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
      <img
        src={image}
        alt="InstaClone"
        className="w-12 h-12 sm:w-18 sm:h-18 animate-bounce mb-4"
      />
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-500 animate-pulse text-center font-sans">
        Loading InstaClone...
      </h1>
    </div>
  );
};

export default FullScreenLoader;
