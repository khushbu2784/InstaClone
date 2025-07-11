import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { LogOut, Pencil, ShieldOff, Users,Lock } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { setSelectedPost, setPosts } from "@/redux/postSlice";
import ThemeToggle from "@/components/ThemeToggle";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const settingsOptions = [
    {
      label: "Edit Profile",
      icon: <Pencil size={18} />,
      action: () => navigate("/account/edit"),
    },
    {
      label: "Blocked Users",
      icon: <ShieldOff size={18} />,
      action: () => navigate("/setting/blocked"),
    },
    {
      label: "Switch Account",
      icon: <Users size={18} />,
      action: () => navigate("/switch"),
    },
    {
      label: "Logout",
      icon: <LogOut size={18} />,
      action: handleLogout,
      danger: true,
    },
    {
      label: "Change Password",
      icon: <Lock size={18} />, // ✅ Changed from ShieldOff to Lock
      action: () => navigate("/changePassword"),
    },
    {
      label: "Theme",
      custom: true,
    },
  ];

  return (
    <div className="max-w-lg mx-auto p-4 mt-[5%] dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
      <div className="space-y-4 pb-10">
        {settingsOptions.map((option, idx) =>
          option.custom ? (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3 rounded-xl shadow-sm border border-gray-300 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-white cursor-pointer hover:bg-gray-200"
            >
              <span className="font-medium">Change Theme</span>
              <ThemeToggle />
            </div>
          ) : (
            <div
              key={idx}
              onClick={option.action}
              className={`flex items-center justify-between px-4 py-3 rounded-xl shadow-sm cursor-pointer border border-gray-300 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 ${
                option.danger ? "text-red-600" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Setting;
