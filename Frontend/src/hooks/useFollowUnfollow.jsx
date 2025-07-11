import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setAuthUser,
  setUserProfile,
  updateSuggestedUser,
} from "@/redux/authSlice";
import { toast } from "sonner";

const useFollowUnfollow = () => {
  const dispatch = useDispatch();

  const toggleFollow = async (targetUserId, currentUser, options = {}) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/followorunfollow/${targetUserId}`,
        {},
        {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCurrentUser = res.data.user;
        const updatedTargetUser = res.data.targetUser;

        dispatch(setAuthUser(updatedCurrentUser));
        dispatch(updateSuggestedUser(updatedTargetUser));

        // ✅ Only update userProfile if explicitly required
        if (options.shouldUpdateProfile) {
          dispatch(setUserProfile(updatedTargetUser));
        }

        const isFollowing = updatedCurrentUser.following.includes(
          updatedTargetUser._id
        );
        toast.success(isFollowing ? "Followed user" : "Unfollowed user");

        return { updatedCurrentUser, updatedTargetUser };
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Follow/Unfollow failed", error);
      toast.error("Failed to follow/unfollow user");
    }
  };

  return { toggleFollow };
};

export default useFollowUnfollow;
