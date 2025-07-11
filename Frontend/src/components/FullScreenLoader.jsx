// src/components/FullScreenLoader.jsx
import React from "react";
import image from "@/assets/image.png"; // ✅ use your own logo or replace path

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <img
        src={image}
        alt="InstaClone"
        className="w-8 h-8 sm:w-14 sm:h-14 animate-bounce mb-2"
      />
      <h1 className="text-xl font-serif text-pink-500 animate-pulse">
        Loading InstaClone...
      </h1>
    </div>
  );
};

export default FullScreenLoader;
