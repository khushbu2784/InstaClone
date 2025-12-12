// import { useDispatch } from "react-redux";
// import axios from "axios";
// import {
//   setAuthUser,
//   setUserProfile,
//   updateSuggestedUser,
// } from "@/redux/authSlice";
// import { toast } from "sonner";

// const useFollowUnfollow = () => {
//   const dispatch = useDispatch();
//   const toggleFollow = async (targetUserId, currentUser, options = {}) => {
//     const isCurrentlyFollowing = currentUser.following.includes(targetUserId);
//     const updatedFollowing = isCurrentlyFollowing
//       ? currentUser.following.filter((id) => id !== targetUserId)
//       : [...currentUser.following, targetUserId];

//     const optimisticUser = { ...currentUser, following: updatedFollowing };
//     dispatch(setAuthUser(optimisticUser)); //Instant UI update
//     //Instant toast
//     toast.success(!isCurrentlyFollowing ? "Followed user" : "Unfollowed user");

//     try {
//       const res = await axios.post(
//         `${
//           import.meta.env.VITE_API_BASE_URL
//         }/user/followorunfollow/${targetUserId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${currentUser?.token}` },
//           withCredentials: true,
//         }
//       );

//       if (res.data.success) {
//         const updatedCurrentUser = res.data.user;
//         const updatedTargetUser = res.data.targetUser;

//         dispatch(setAuthUser(updatedCurrentUser));
//         dispatch(updateSuggestedUser(updatedTargetUser));

//         if (options.shouldUpdateProfile) {
//           dispatch(setUserProfile(updatedTargetUser));
//         }

//         return { updatedCurrentUser, updatedTargetUser };
//       } else {
//         throw new Error("API error");
//       }
//     } catch (error) {
//       dispatch(setAuthUser(currentUser)); // Revert optimistic update
//       toast.error("Failed to follow/unfollow user");
//       console.error("Follow/Unfollow failed", error);
//     }
//   };

//   return { toggleFollow };
// };

// export default useFollowUnfollow;

// import axios from "axios";
// import { useDispatch } from "react-redux";
// import {
//   setAuthUser,
//   updateSuggestedUser,
//   setUserProfile,
// } from "@/redux/authSlice";
// import { toast } from "sonner";

// const useFollowUnfollow = () => {
//   const dispatch = useDispatch();

//   const toggleFollow = async (targetUserId, currentUser, options = {}) => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/user/followorunfollow/${targetUserId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${currentUser?.token}` },
//           withCredentials: true,
//         }
//       );

//       if (!res.data.success) throw new Error("API Error");

//       const updatedCurrentUser = res.data.user;
//       const updatedTargetUser = res.data.targetUser;

//       // Update redux store
//       dispatch(setAuthUser(updatedCurrentUser));
//       dispatch(updateSuggestedUser(updatedTargetUser));

//       if (options.shouldUpdateProfile) {
//         dispatch(setUserProfile(updatedTargetUser));
//       }

//       toast.success(res.data.message);

//       return { updatedCurrentUser, updatedTargetUser };
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update follow state");
//       return null;
//     }
//   };

//   return { toggleFollow };
// };

// export default useFollowUnfollow;

import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setAuthUser,
  updateSuggestedUser,
  setUserProfile,
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
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        throw new Error("Follow API error");
      }

      const updatedCurrentUser = res.data.user;
      const updatedTargetUser = res.data.targetUser;

      // Update redux
      dispatch(setAuthUser(updatedCurrentUser));
      dispatch(updateSuggestedUser(updatedTargetUser));

      if (options.shouldUpdateProfile) {
        dispatch(setUserProfile(updatedTargetUser));
      }

      toast.success(res.data.message);

      return { updatedCurrentUser, updatedTargetUser };
    } catch (err) {
      console.log(err);
      toast.error("Failed to update follow status");
      return null;
    }
  };

  return { toggleFollow };
};

export default useFollowUnfollow;

