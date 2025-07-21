import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/changePassword`,
        { oldPassword, newPassword },
        {
          withCredentials: true,
        }
      );
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form
        onSubmit={handleChangePassword}
        className="w-full max-w-sm bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-6 py-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Change Password 🔐
        </h2>

        <div className="space-y-2">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          Update Password
        </button>

        {message && (
          <p className="text-center text-sm mt-2 text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
