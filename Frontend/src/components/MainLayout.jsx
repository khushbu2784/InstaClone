import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import BottomNav from "./BottomNav";
import CreatePostDialog from "./post/CreatePostDialog";
import SearchUsers from "./SearchUsers";
import Topbar from "./TopBar";
import FullScreenLoader from "./FullScreenLoader";

const MainLayout = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // List of public routes
  const publicRoutes = [
    "/login",
    "/signup",
    "/verifyEmail",
    "/forgotPassword",
  ];

  const isResetPassword = location.pathname.startsWith("/resetPassword");
  const is404 = location.pathname === "/404" || location.pathname === "*";
  const isPublic =
    publicRoutes.includes(location.pathname) || isResetPassword || is404;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulated load
    return () => clearTimeout(timer);
  }, []);

  if (loading && !isPublic) return <FullScreenLoader />;

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex">
      {/* Side Bar */}
      <div className="hidden md:block">
        <LeftSideBar
          setCreateDialogOpen={setCreateDialogOpen}
          setSearchOpen={setSearchOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        <Topbar />
        <Outlet />
        <BottomNav
          setCreateDialogOpen={setCreateDialogOpen}
          setSearchOpen={setSearchOpen}
        />
        <CreatePostDialog
          open={createDialogOpen}
          setOpen={setCreateDialogOpen}
        />
        <SearchUsers open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </div>
  );
};

export default MainLayout;
