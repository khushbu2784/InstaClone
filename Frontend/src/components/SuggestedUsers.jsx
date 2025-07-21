import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import noProfile from "@/assets/Profile.png";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const { toggleFollow } = useFollowUnfollow();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated delay (you can remove this if already handled in Redux)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFollow = async (targetUserId) => {
    const result = await toggleFollow(targetUserId, user);

    if (result?.updatedCurrentUser) {
      // Optimistically remove user from suggestions list
      const updatedSuggestions = suggestedUsers.filter(
        (u) => u?._id !== targetUserId
      );
      dispatch(setSuggestedUsers(updatedSuggestions));
    }
  };

  //   const result = await toggleFollow(targetUserId);
  //   if (result?.updatedCurrentUser) {
  //     dispatch(setAuthUser(result.updatedCurrentUser));
  //     const updatedSuggestions = suggestedUsers.filter(
  //       (u) => u?._id !== targetUserId
  //     );
  //     dispatch(setSuggestedUsers(updatedSuggestions));
  //   }
  // };

  const filteredSuggestions = suggestedUsers.filter(
    (u) => u?._id !== user?._id && !user?.following.includes(u?._id)
  );

  return (
    <div className="my-8 mx-4 sm:mx-0 p-2 bg-white dark:bg-gray-900 rounded-lg sm:shadow-sm shadow-md">
      <div className="flex items-center justify-between text-sm mb-4">
        <h2 className="text-gray-600 dark:text-gray-300 font-semibold">
          Suggested for you
        </h2>
        <span className="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline">
          See All
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-6 w-14 bg-blue-200 dark:bg-blue-400 rounded" />
            </div>
          ))}
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center dark:text-gray-400">
          No suggestions available.
        </p>
      ) : (
        filteredSuggestions.map((u) => (
          <div
            key={u?._id}
            className="flex items-center justify-between mb-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2 py-1"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${u?._id}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={u.profilePicture}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <img src={noProfile} alt="fallback" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${u?._id}`}>
                  <p className="font-semibold text-sm">{u.userName}</p>
                </Link>
                <p className="text-xs text-gray-500 max-h-[30px] overflow-hidden text-ellipsis">
                  {u.bio || "Bio here.."}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(u?._id)}
              className="text-xs font-bold text-blue-500 hover:text-blue-700"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SuggestedUsers;
