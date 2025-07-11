import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-2">Oops! Page not found.</p>
      <p className="mb-6 text-gray-500">The page you're looking for doesn't exist or was moved.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full shadow hover:scale-105 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
