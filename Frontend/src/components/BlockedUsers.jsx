import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // ✅ get logged-in user

  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/blocked`, {
        withCredentials: true,
      });
      setBlockedUsers(res.data.blockedUsers);
    } catch (err) {
      console.error("Failed to fetch blocked users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/block/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // ✅ Update blocked list immediately
      setBlockedUsers((prev) => prev.filter((user) => user._id !== userId));

      // ✅ Remove from following list if it existed
      const updatedFollowing = user.following.filter((id) => id !== userId);
      dispatch(setAuthUser({ ...user, following: updatedFollowing }));

      // ✅ Refresh suggested users
      const suggestedRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/suggested`,
        {
          withCredentials: true,
        }
      );
      dispatch(setSuggestedUsers(suggestedRes.data.users));
    } catch (err) {
      console.error("Unblock failed:", err);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-4 sm:mt-10 sm:ml-[20%]">
      <h2 className="text-xl font-bold mb-4">Blocked Users</h2>
      {blockedUsers.length === 0 ? (
        <p className="text-gray-500">You haven't blocked anyone.</p>
      ) : (
        <div className="space-y-4">
          {blockedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 border-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                //onClick={() => navigate(`/profile/${user._id}`)}
              >
                <img
                  src={user.profilePicture}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.userName}</p>
                  <p className="text-sm text-gray-500">{user.name}</p>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(user._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
