import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import instaLogo from "@/assets/Logo.png";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/resetPassword/${token}`,
        { password },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      // ❗ Clear any existing token cookie before redirecting to login
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="mt-6">
          <img
            src={instaLogo}
            alt="Logo"
            className="h-10 w-36 mb-10 mx-auto dark:invert"
          />
        </div>
        <h2 className="text-pretty text-xl font-semibold mb-4">
          Reset Password
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        />

        <Button
          onClick={handleResetPassword}
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
