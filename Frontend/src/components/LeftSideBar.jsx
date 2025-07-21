import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
  X,
  UserPlus, // 👈 for follow
  Bell, // fallback
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import CreatePostDialog from "./CreatePostDialog";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import Logo from "@/assets/Logo.png";
import noProfile from "@/assets/Profile.png";
import { clearNotificationBadge } from "@/redux/rtnSlice";
import SearchUsers from "./SearchUsers";
import ThemeToggle from "./ThemeToggle";
import NotificationPanel from "../Pages/NotificationPanel";
import { resetNotifications } from "@/redux/rtnSlice";
import { FaHeart, FaUser } from "react-icons/fa";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const unreadMap = useSelector((store) => store.chat?.unreadMap || {});
  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);
  const { user } = useSelector((state) => state.auth);
  const {
    unreadCount,
    badgeCleared,
    allNotifications = [],
    recentTypes = [],
  } = useSelector((state) => state.realTimeNotifications);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(resetNotifications());
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

  const sidebarHandler = (textType) => {
    if (!user && textType !== "Logout") return;

    switch (textType) {
      case "Logout":
        handleLogout();
        break;
      case "Create":
        setCreateDialogOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Search":
        setSearchOpen(true);
        break;
      case "Notifications":
        setNotificationOpen(true);
        dispatch(clearNotificationBadge()); // Clear only the badge
        break;
      case "Explore":
        navigate("/explore");
        break;
      case "More":
        navigate("/setting");
        break;
      default:
        break;
    }
    setSidebarOpen(false);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    {
      icon: (
        <div className="relative">
          <MessageCircle className="text-xl" />
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-bold">
              {totalUnread}
            </span>
          )}
        </div>
      ),
      text: "Messages",
    },
    {
      icon: (
        <div className="relative">
          <Heart className="text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[20px] h-[18px] px-1 flex items-center justify-center text-[11px] font-bold shadow z-10 gap-[2px]">
              <div className="flex items-center gap-[2px]">
                {recentTypes.includes("like") && (
                  <FaHeart className="w-3 h-3" />
                )}
                {recentTypes.includes("follow") && (
                  <FaUser className="w-3 h-3" />
                )}
                <span>{unreadCount}</span>
              </div>
            </span>
          )}
        </div>
      ),
      text: "Notifications",
    },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profilePicture} alt="@profile" className="object-cover"/>
          <AvatarFallback>
            <img src={noProfile} alt="profile fallback" />
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
    { icon: <Menu />, text: "More" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-16 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[70%] sm:w-[50%] md:w-[30%] lg:w-[16%] px-4 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full pt-10">
          <img
            src={Logo}
            alt="Logo"
            className="h-8 w-32 mb-4 mx-auto dark:invert"
          />
          <div className="mb-4 text-center">
            <ThemeToggle />
          </div>

          <div className="flex flex-col gap-1">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-150"
                onClick={() => sidebarHandler(item.text)}
              >
                <div className="text-xl">{item.icon}</div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <CreatePostDialog
          open={createDialogOpen}
          setOpen={setCreateDialogOpen}
        />
      </div>

      <SearchUsers open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationPanel
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </>
  );
};

export default LeftSideBar;
