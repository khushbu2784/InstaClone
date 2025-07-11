import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import noProfile from "@/assets/Profile.png";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  return (
    <div className="w-[450px] my-10 pr-32 sticky hidden sm:block text-black dark:text-white">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="postImage" />
            <AvatarFallback>
              <img src={noProfile} alt="fallback" />
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.userName}</Link>
            </h1>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {user?.bio || "Bio here.."}
            </span>
          </div>

          <span
            onClick={() => navigate("/switch")}
            className="text-[#3BADF8] dark:text-blue-400 text-xs font-bold cursor-pointer hover:text-[#79b0d4] dark:hover:text-blue-300"
          >
            Switch
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSideBar;
