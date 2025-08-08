import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Feed from "@/components/post/Feed";
import RightSideBar from "@/components/RightSideBar";
import Stories from "@/components/story/Stories";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center bg-white dark:bg-gray-900 min-h-screen">
      {/* 👇 Main content area with Feed */}
      <div className="flex flex-col flex-1 max-w-[1200px] lg:ml-60 w-full">
        {/* ✅ Sticky Stories section */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 px-2 sm:px-6 py-2 mr-6">
          <Stories />
        </div>

        {/* ✅ Feed */}
        <div className="w-full">
          <Feed />
        </div>

        {/* ✅ Nested Routes */}
        <Outlet />
      </div>

      {/* ✅ Right Sidebar (hidden on small screens) */}
      <div className="hidden lg:block">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
