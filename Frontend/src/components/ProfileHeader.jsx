import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Settings } from "lucide-react";
import noProfile from "@/assets/Profile.png";

const ProfileHeader = ({
  userProfile,
  isFollow,
  isLoggedInUserProfile,
  isBlockedByMe,
  mutualFollowers = [],
  mutualCount = 0,
  followersCount,
  followingCount,
  handleFollowUnfollow,
  handleMessageClick,
  handleBlockToggle,
  setActionUser,
  setShowActionSheet,
  fetchUserList,
}) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Profile Picture */}
      <div onClick={() => setIsPhotoOpen(true)} className="cursor-pointer">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={userProfile?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback>
            <img src={noProfile} alt="fallback" />
          </AvatarFallback>
        </Avatar>
      </div>

      {isPhotoOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setIsPhotoOpen(false)}
        >
          <Avatar className="sm:h-96 sm:w-96 h-64 w-64">
            <AvatarImage
              src={userProfile?.profilePicture}
              className="object-cover"
            />
            <AvatarFallback>
              <img src={noProfile} alt="fallback" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Info Section */}
      <div className="flex-1 w-full space-y-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-xl font-semibold text-center sm:text-left">
            {userProfile?.userName}
          </h2>

          {isLoggedInUserProfile ? (
            <div className="w-full grid grid-cols-2 sm:flex gap-2">
              <Link to="/account/edit" className="col-span-1 sm:w-auto">
                <Button
                  size="sm"
                  className="w-full h-8 text-sm rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white"
                >
                  Edit Profile
                </Button>
              </Link>
              <Button
                size="sm"
                className="col-span-1 w-full sm:w-auto h-8 text-sm rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white"
              >
                View Archive
              </Button>
              <Link to="/setting" className="col-span-2 sm:w-auto">
                <Button
                  size="sm"
                  className="w-full sm:w-auto h-8 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black rounded-xl dark:text-white flex justify-center items-center"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : isBlockedByMe ? (
            <div className="flex justify-center sm:justify-start gap-2 flex-wrap w-full mt-2">
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl w-1/2 sm:w-60 h-8 font-semibold ml-8 sm:mx-0"
                onClick={handleBlockToggle}
              >
                Unblock
              </Button>
              <button
                onClick={() => {
                  setActionUser(userProfile);
                  setShowActionSheet(true);
                }}
                className="text-2xl font-bold px-2"
              >
                ⋯
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
              {/* Buttons */}
              <div className="flex justify-center sm:justify-start gap-2 flex-wrap w-full mt-2">
                <Button
                  size="sm"
                  className={`rounded-lg ${
                    isFollow
                      ? "h-8 bg-gray-300/50 hover:bg-gray-300/70 dark:bg-gray-700 dark:hover:bg-gray-600"
                      : "bg-[#0095F6] hover:bg-[#3192d2] h-8 text-white font-bold"
                  }`}
                  onClick={handleFollowUnfollow}
                >
                  {isFollow ? "Unfollow" : "Follow"}
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-gray-300/50 hover:bg-gray-300/70 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={handleMessageClick}
                >
                  Message
                </Button>
                <button
                  onClick={() => {
                    setActionUser(userProfile);
                    setShowActionSheet(true);
                  }}
                  className="text-2xl font-bold px-2"
                >
                  ⋯
                </button>
              </div>
            </div>
          )}
        </div>

        {!isBlockedByMe && (
          <div className="flex justify-center sm:justify-start gap-6 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-bold">
                {userProfile?.posts?.length || 0}
              </span>{" "}
              posts
            </p>
            <p
              className="cursor-pointer"
              onClick={() => fetchUserList("followers")}
            >
              <span className="font-bold">{followersCount}</span> followers
            </p>
            <p
              className="cursor-pointer"
              onClick={() => fetchUserList("following")}
            >
              <span className="font-bold">{followingCount}</span> following
            </p>
          </div>
        )}

        {/* Bio */}
        <div>
          <Badge className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white">
            <AtSign size={14} />
            <span className="pl-1">{userProfile?.userName}</span>
          </Badge>
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            {userProfile?.bio || "No bio available"}
          </p>
        </div>

        {/* Mutual followers */}
        {!isLoggedInUserProfile &&
          !isBlockedByMe &&
          mutualFollowers?.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              <div className="flex -space-x-2">
                {mutualFollowers.slice(0, 3).map((follower, idx) => (
                  <Link
                    to={`/profile/${follower._id}`}
                    key={follower._id}
                    className="z-10"
                    style={{ zIndex: 10 - idx }}
                  >
                    <img
                      src={follower.profilePicture || noProfile}
                      alt={follower.userName}
                      className="w-6 h-6 rounded-full border border-white dark:border-gray-800"
                    />
                  </Link>
                ))}
              </div>
              <div>
                Followed by{" "}
                <Link
                  to={`/profile/${mutualFollowers[0]._id}`}
                  className="font-semibold hover:underline"
                >
                  {mutualFollowers[0].userName}
                </Link>
                {mutualCount > 1 && (
                  <>
                    {" and "}
                    <span className="font-semibold">
                      {mutualCount - 1} other{mutualCount > 2 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProfileHeader;
