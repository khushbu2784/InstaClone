// // src/components/FullScreenLoader.jsx
// import React from "react";
// import image from "@/assets/image.png"; 

// const FullScreenLoader = () => {
//   return (
//     <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
//       <img
//         src={image}
//         alt="InstaClone"
//         className="w-20 h-20 sm:w-18 sm:h-18  mb-4"
//       />
//       {/* <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-500 animate-pulse text-center font-sans">
//         Loading InstaClone...
//       </h1> */}
//     </div>
//   );
// };

// export default FullScreenLoader;

// src/components/FullScreenLoader.jsx
import React from "react";
import image from "@/assets/image.png";

const FullScreenLoader = () => {
  return (
    // 1. Single fixed container covering the entire viewport
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
      
      {/* 2. Logo Container: Uses flex-grow to take up all available space
          and center the logo vertically, pushing the footer down. */}
      <div className="flex-grow flex items-center justify-center">
        <img
          src={image}
          alt="InstaClone Logo"
          // Increased size and subtle animation for better focus
          className="w-28 h-28 sm:w-18 sm:h-18 mb-4 animate-pulse" 
        />
      </div>

      {/* 3. Branding Footer: Fixed position at the very bottom.
          Added pb-8 for typical bottom padding/margin. */}
      <div className="flex flex-col items-center justify-center pb-8">
        <span className="text-gray-400 text-md tracking-wider uppercase mb-1">
          from
        </span>
        <h1 className="text-xl font-semibold text-pink-500 font-sans">
          InstaClone
        </h1>
        {/* Optional: Use the Meta aesthetic */}
        {/* <h1 className="text-sm font-semibold text-blue-600 font-sans">
          Meta
        </h1> */}
      </div>
      
    </div>
  );
};

export default FullScreenLoader;