import { Heart, MessageCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setSelectedUser } from "@/redux/authSlice";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";
import { toast } from "sonner";
import PostPreviewModel from "@/components/post/PostPreviewModel";
import UserListDialog from "@/components/profile/UserListDialog";
import ActionSheet from "@/components/profile/ActionSheet";
import ProfileHeader from "@/components/profile/ProfileHeader";

const Profile = () => {
  const { id: userId } = useParams();
  const { refetch, mutualFollowers, mutualCount, blocked } = useGetUserProfile(userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleFollow } = useFollowUnfollow();
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isBlockedByMe = blocked && !isLoggedInUserProfile;
  const [isFollow, setIsFollow] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showList, setShowList] = useState(false);
  const [listType, setListType] = useState("followers");
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionUser, setActionUser] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [tabLoading, setTabLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTabLoading(true);
    const timeout = setTimeout(() => {
      setTabLoading(false);
    }, 300); // simulate smooth loading transition
    return () => clearTimeout(timeout);
  }, [userProfile, activeTab]);

  useEffect(() => {
    const isFollowing = userProfile?.followers?.some(
      (f) => f._id === user?._id
    );
    setIsFollow(isFollowing);
    setFollowersCount(userProfile?.followers?.length || 0);
    setFollowingCount(userProfile?.following?.length || 0);
  }, [userProfile, user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await refetch(); // ensures full profile reload
      } catch (e) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false); // hide loader when done
        setTabLoading(false);
      }
    };

    loadProfile();
  }, [refetch]);

  const handleFollowUnfollow = async () => {
    const res = await toggleFollow(userProfile?._id, user);
    if (res?.updatedTargetUser) {
      setFollowersCount(res.updatedTargetUser.followers.length);
      setFollowingCount(res.updatedCurrentUser.following.length);
      setIsFollow(res.updatedCurrentUser.following.includes(userProfile?._id));
    }
    await refetch();
  };

  const handleFollowChange = ({ followersCount, followingCount }) => {
    if (typeof followersCount === "number") setFollowersCount(followersCount);
    if (typeof followingCount === "number") setFollowingCount(followingCount);
  };

  const handleMessageClick = () => {
    dispatch(setSelectedUser(userProfile));
    navigate("/chat");
  };

  const handleBlockToggle = async () => {
    setShowActionSheet(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/block/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
      await refetch();
    } catch (err) {
      console.error("Error toggling block/unblock:", err);
      toast.error("Something went wrong while trying to block/unblock the user.");
    }
  };

  const fetchUserList = async (type) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userProfile?._id}/${type}`,
        { withCredentials: true }
      );
      const list =
        type === "followers" ? res.data.followers : res.data.following;
      setUserList(list || []);
      setListType(type);
      setShowList(true);
    } catch (err) {
      console.error("Failed to fetch list:", err);
    }
  };

  const filteredList = userList.filter((u) =>
    u.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const profileTabs = useMemo(() => {
    const tabs = [
      { key: "posts", label: "POSTS" },
      { key: "reels", label: "REELS" },
      { key: "tagged", label: "TAGGED" },
    ];
    if (isLoggedInUserProfile) {
      tabs.splice(2, 0, { key: "saved", label: "SAVED" });
    }
    return tabs;
  }, [isLoggedInUserProfile]);

  const displayedPost = useMemo(() => {
    const sortPosts = (arr = []) =>
      [...arr].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    return {
      posts: sortPosts(userProfile?.posts),
      saved: sortPosts(
        userProfile?.bookmarks?.filter(
          (post) =>
            post?.author &&
            !user?.blockedUsers?.includes(post.author._id) &&
            !user?.blockedBy?.includes(post.author._id)
        )
      ),
      reels: sortPosts(userProfile?.posts?.filter((p) => p.type === "reels")),
      tagged: sortPosts(userProfile?.taggedPosts),
    }[activeTab];
  }, [activeTab, userProfile, user]);

  if (loading) {
    return (
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-32 py-10 space-y-8 animate-pulse text-black dark:text-white">
        {/* Profile header skeleton */}
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Tab row */}
        <div className="flex justify-center gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-32 py-10 text-black dark:text-white">
      <ProfileHeader
        userProfile={userProfile}
        user={user}
        isFollow={isFollow}
        isLoggedInUserProfile={isLoggedInUserProfile}
        isBlockedByMe={isBlockedByMe}
        mutualFollowers={mutualFollowers}
        mutualCount={mutualCount}
        followersCount={followersCount}
        followingCount={followingCount}
        handleFollowUnfollow={handleFollowUnfollow}
        handleMessageClick={handleMessageClick}
        handleBlockToggle={handleBlockToggle}
        setActionUser={setActionUser}
        setShowActionSheet={setShowActionSheet}
        fetchUserList={fetchUserList}
      />

      {/* Post Grid */}
      {!isBlockedByMe && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-10">
            <div className="flex justify-center gap-6 text-sm font-semibold py-3">
              {profileTabs.map((tab) => (
                <span
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1 cursor-pointer ${
                    activeTab === tab.key
                      ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab.icon} {tab.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mt-4">
            {tabLoading ? (
              [...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md border border-gray-200 dark:border-gray-700"
                />
              ))
            ) : displayedPost?.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                No posts to display.
              </div>
            ) : (
              displayedPost.map((post, index) => (
                <div
                  key={post._id || index}
                  className="relative group cursor-pointer w-full aspect-square overflow-hidden"
                  onClick={() => {
                    setSelectedPost(post);
                    setOpenPreview(true);
                  }}
                >
                  <img
                    src={post.image}
                    alt="post"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-4 text-white">
                    <span className="flex items-center gap-1">
                      <Heart size={16} /> {post?.likes?.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} /> {post?.comments?.length}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <PostPreviewModel
            open={openPreview}
            setOpen={setOpenPreview}
            post={selectedPost}
          />
        </>
      )}

      {showList && (
        <UserListDialog
          visible={showList}
          onClose={() => setShowList(false)}
          list={filteredList}
          type={listType}
          currentUserId={user?._id}
          isMyProfile={isLoggedInUserProfile}
          refetchList={() => fetchUserList(listType)}
          onFollowChange={handleFollowChange}
        />
      )}

      {showActionSheet && actionUser && (
        <ActionSheet
          user={actionUser}
          onClose={() => setShowActionSheet(false)}
          onBlock={handleBlockToggle}
          isBlocked={blocked}
        />
      )}
    </div>
  );
};

export default Profile;
