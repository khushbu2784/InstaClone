import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/lib/validate";
import { toast } from "sonner";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/changePassword`,
        data,
        { withCredentials: true }
      );
      toast.success("Password updated successfully!");
      setMessage(res.data.message);
      reset();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-6 py-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Change Password 🔐
        </h2>

        <div className="space-y-2">
          <input
            type="password"
            placeholder="Current password"
            {...register("oldPassword")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
          )}

          <input
            type="password"
            placeholder="New password"
            {...register("newPassword")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Updating..." : "Update Password"}
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
